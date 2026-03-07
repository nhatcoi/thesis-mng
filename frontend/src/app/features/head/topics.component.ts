import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TopicRegistrationService, TopicRegistration } from '../../core/topic-registration.service';
import { AuthService } from '../../core/auth.service';
import { LecturerService, Lecturer } from '../../core/lecturer.service';

@Component({
  selector: 'app-head-topics',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="space-y-6">
      <div class="app-section-header">
        <h2 class="app-title">Phê duyệt đề tài sinh viên</h2>
        <p class="app-subtitle">Xem xét các đề tài do sinh viên tự đề xuất và phân công giảng viên hướng dẫn.</p>
      </div>
      
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      } @else if (proposals().length === 0) {
        <div class="bg-white rounded-xl border border-dashed border-gray-300 py-12 text-center">
          <mat-icon class="text-gray-300 text-5xl mb-2">assignment_late</mat-icon>
          <p class="text-gray-500">Không có đề xuất đề tài nào cần phê duyệt hiện tại.</p>
        </div>
      } @else {
        <div class="grid gap-4">
          @for (p of proposals(); track p.id) {
            <div class="app-card">
              <div class="flex flex-col md:flex-row justify-between gap-6">
                <div class="flex-grow space-y-2">
                  <div class="flex items-center gap-2">
                    <span [class]="getStatusClass(p.status)" class="app-badge">
                      {{ p.status === 'PENDING' ? 'CHỜ DUYỆT' : p.status }}
                    </span>
                    <span class="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      {{ p.createdAt | date:'dd/MM/yyyy HH:mm' }}
                    </span>
                  </div>
                  
                  <h3 class="text-base font-bold text-gray-900">{{ p.topicTitle }}</h3>
                  
                  <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <div class="flex items-center gap-1">
                      <mat-icon class="!w-3.5 !h-3.5 !text-[14px]">person</mat-icon>
                      <span>SV: <span class="font-semibold text-gray-700">{{ p.studentName }}</span> ({{ p.studentCode }})</span>
                    </div>
                  </div>
                </div>

                <div class="shrink-0 flex flex-col gap-3 min-w-[280px] bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Phân công giảng viên & Duyệt</label>
                  
                  <div class="space-y-3">
                    <select #lecturerSelect class="app-select w-full !py-1.5 text-xs">
                      <option value="">-- Chọn giảng viên hướng dẫn --</option>
                      @for (l of lecturers(); track l.id) {
                        <option [value]="l.id">
                          {{ l.lastName }} {{ l.firstName }} ({{ l.lecturerCode }})
                        </option>
                      }
                    </select>

                    <div class="flex gap-2">
                      <button 
                        (click)="approve(p, lecturerSelect.value)"
                        [disabled]="processingId() === p.id"
                        class="app-btn-primary flex-grow !py-1.5 text-xs">
                        @if (processingId() === p.id) {
                          <span class="animate-pulse">Đang xử lý...</span>
                        } @else {
                          Duyệt & Phân công
                        }
                      </button>
                      <button 
                        (click)="reject(p)"
                        class="app-btn-ghost !text-red-500 hover:!bg-red-50 !py-1.5 text-xs">
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class TopicsComponent implements OnInit {
  private registrationService = inject(TopicRegistrationService);
  private authService = inject(AuthService);
  private lecturerService = inject(LecturerService);
  private snackBar = inject(MatSnackBar);

  proposals = signal<TopicRegistration[]>([]);
  lecturers = signal<Lecturer[]>([]);
  loading = signal(true);
  processingId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProposals();
    this.loadLecturers();
  }

  loadProposals(): void {
    this.loading.set(true);
    this.registrationService.getMajorRegistrations().subscribe({
      next: (res) => {
        // Chỉ lấy các cái PENDING và là từ STUDENT proposal
        this.proposals.set((res.data || []).filter((r: any) => r.status === 'PENDING' && r.topicSource === 'STUDENT'));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadLecturers(): void {
    const user = this.authService.currentUser();
    // Lấy giảng viên cùng khoa
    this.lecturerService.getLecturers({ facultyId: user?.facultyId }).subscribe({
      next: (data) => this.lecturers.set(data)
    });
  }

  approve(reg: TopicRegistration, lecturerId: string): void {
    if (!lecturerId) {
      this.snackBar.open('Vui lòng chọn giảng viên hướng dẫn', 'Đóng', { duration: 3000 });
      return;
    }

    this.processingId.set(reg.id);
    this.registrationService.approveRegistration(reg.id, { 
      status: 'APPROVED',
      advisorId: lecturerId
    }).subscribe({
      next: () => {
        this.snackBar.open('Đã duyệt đề tài và phân công giảng viên', 'Đóng', { duration: 3000 });
        this.proposals.update(all => all.filter(p => p.id !== reg.id));
        this.processingId.set(null);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Có lỗi xảy ra', 'Đóng', { duration: 3000 });
        this.processingId.set(null);
      }
    });
  }

  reject(reg: TopicRegistration): void {
    const reason = prompt('Nhập lý do từ chối:');
    if (reason === null) return;

    this.processingId.set(reg.id);
    this.registrationService.approveRegistration(reg.id, { 
      status: 'REJECTED',
      rejectReason: reason 
    }).subscribe({
      next: () => {
        this.snackBar.open('Đã từ chối đề tài', 'Đóng', { duration: 3000 });
        this.proposals.update(all => all.filter(p => p.id !== reg.id));
        this.processingId.set(null);
      },
      error: () => this.processingId.set(null)
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'border-amber-100 bg-amber-50 text-amber-600';
      case 'APPROVED': return 'border-emerald-100 bg-emerald-50 text-emerald-600';
      case 'REJECTED': return 'border-red-100 bg-red-50 text-red-600';
      default: return 'border-gray-100 bg-gray-50 text-gray-600';
    }
  }
}
