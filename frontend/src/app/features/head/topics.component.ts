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
    <div class="space-y-6 max-w-6xl mx-auto">
      <div class="app-section-header">
        <div class="flex items-center gap-2 mb-1">
          <span class="app-badge !bg-indigo-600 !text-white border-none !text-[9px] !px-2">TRƯỞNG NGÀNH</span>
          <span class="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{{ auth.currentUser()?.managedMajorName }}</span>
        </div>
        <h2 class="app-title">Phê duyệt đề tài sinh viên</h2>
        <p class="app-subtitle">Xem xét các đề tài do sinh viên tự đề xuất và phân công giảng viên hướng dẫn cho sinh viên ngành {{ auth.currentUser()?.managedMajorName }}.</p>
      </div>
      
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      } @else if (proposals().length === 0) {
        <div class="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center animate-in fade-in zoom-in-95">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <mat-icon class="text-gray-300 !text-[32px]">assignment_late</mat-icon>
          </div>
          <h3 class="text-sm font-bold text-gray-900">Không có đề xuất mới</h3>
          <p class="text-xs text-gray-500 mt-1">Hiện không có đề tài nào đang chờ bạn phê duyệt.</p>
        </div>
      } @else {
        <div class="grid gap-6">
          @for (p of proposals(); track p.id) {
            <div class="app-card !p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div class="flex flex-col lg:flex-row min-h-[180px]">
                <!-- Topic Info Section -->
                <div class="flex-grow p-6 lg:p-8 space-y-4">
                  <div class="flex items-center gap-3">
                    <span [class]="getStatusClass(p.status)" class="app-badge !px-2.5 !py-1 !font-black !text-[10px]">
                      {{ p.status === 'PENDING' ? 'CHỜ DUYỆT' : p.status }}
                    </span>
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      Gửi lúc: {{ p.createdAt | date:'dd/MM/yyyy HH:mm' }}
                    </span>
                  </div>
                  
                  <div>
                    <h3 class="text-lg font-black text-gray-900 leading-tight mb-2 uppercase tracking-tight">{{ p.topicTitle }}</h3>
                    <div class="flex items-center gap-2 text-[11px] font-bold text-indigo-600">
                       <mat-icon class="!w-4 !h-4 !text-[16px]">account_circle</mat-icon>
                       <span>SINH VIÊN: <span class="text-gray-900">{{ p.studentName }}</span> ({{ p.studentCode }})</span>
                    </div>
                  </div>

                  @if (p.topicDescription || p.topicRequirements) {
                    <div class="bg-gray-50/50 rounded-xl p-4 border border-gray-100 space-y-3">
                      @if (p.topicDescription) {
                        <div>
                          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Mô tả chi tiết</span>
                          <p class="text-xs text-gray-600 leading-relaxed">{{ p.topicDescription }}</p>
                        </div>
                      }
                      @if (p.topicRequirements) {
                        <div class="flex items-center gap-2">
                          <span class="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase tracking-widest">
                            Yêu cầu: {{ p.topicRequirements }}
                          </span>
                        </div>
                      }
                    </div>
                  }
                </div>

                <!-- Action Section -->
                <div class="lg:w-80 shrink-0 bg-gray-50/80 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col justify-center">
                  <div class="space-y-4">
                    <div>
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Giảng viên hướng dẫn</label>
                      <select [id]="'lecturer-select-' + p.id"
                        class="app-select w-full !text-xs font-bold border-gray-200">
                        <option value="" [selected]="!p.preferredLecturerId">-- Chọn giảng viên --</option>
                        @for (l of lecturers(); track l.id) {
                          <option [value]="l.id" [selected]="l.id === p.preferredLecturerId">
                            {{ l.lastName }} {{ l.firstName }} ({{ l.lecturerCode }})
                          </option>
                        }
                      </select>
                      @if (p.preferredLecturerId) {
                        <p class="text-[10px] text-indigo-500 font-semibold mt-1.5 flex items-center gap-1">
                          <mat-icon class="!text-[11px] !w-3 !h-3">person</mat-icon>
                          SV mong muốn: {{ p.advisorName }}
                        </p>
                      }
                    </div>

                    <div class="pt-2 flex flex-col gap-2">
                      <button 
                        (click)="approve(p, getLecturerSelectValue(p.id))"
                        [disabled]="processingId() === p.id"
                        class="app-btn-primary w-full justify-center !py-2.5 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-100">
                        @if (processingId() === p.id) {
                          <span class="flex items-center gap-2"><div class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Đang xử lý</span>
                        } @else {
                          Duyệt & Phân công
                        }
                      </button>
                      <button 
                        (click)="reject(p)"
                        class="app-btn-ghost w-full justify-center !text-red-500 hover:!bg-red-50 !py-2 font-black uppercase tracking-widest text-[10px]">
                        Từ chối đề xuất
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
  auth = inject(AuthService);
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
    const user = this.auth.currentUser();
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

  getLecturerSelectValue(proposalId: string): string {
    const select = document.getElementById('lecturer-select-' + proposalId) as HTMLSelectElement;
    return select?.value || '';
  }
}
