import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProgressService, ProgressUpdateResponse } from '../../core/progress.service';

@Component({
  selector: 'app-lecturer-progress',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto">
      <div class="app-section-header">
        <h2 class="app-title">Theo dõi tiến độ sinh viên</h2>
        <p class="app-subtitle">Xem và nhận xét tiến độ thực hiện đồ án.</p>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      } @else if (updates().length === 0) {
        <div class="app-card p-12 text-center">
          <mat-icon class="!text-gray-300 !text-[32px]">trending_up</mat-icon>
          <h3 class="text-sm font-bold text-gray-900 mt-2">Chưa có cập nhật tiến độ</h3>
        </div>
      } @else {
        <!-- Filter tabs -->
        <div class="flex gap-2">
          @for (tab of tabs; track tab.value) {
            <button (click)="activeTab.set(tab.value)"
              class="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all"
              [class]="activeTab() === tab.value
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'">
              {{ tab.label }} ({{ countByStatus(tab.value) }})
            </button>
          }
        </div>

        <div class="grid gap-4">
          @for (u of filteredUpdates(); track u.id) {
            <div class="app-card !p-5 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full"
                    [class]="u.status === 'REVIEWED' ? 'bg-emerald-500' : u.status === 'NEEDS_REVISION' ? 'bg-amber-500' : 'bg-blue-500'"></div>
                  <span class="text-xs font-bold text-gray-900">Tuần {{ u.weekNumber }} · {{ u.title }}</span>
                  <span class="text-[10px] font-bold uppercase tracking-widest"
                    [class]="u.status === 'REVIEWED' ? 'text-emerald-600' : u.status === 'NEEDS_REVISION' ? 'text-amber-600' : 'text-blue-600'">
                    {{ u.status === 'SUBMITTED' ? 'Chờ nhận xét' : u.status === 'REVIEWED' ? 'Đã nhận xét' : 'Cần bổ sung' }}
                  </span>
                </div>
                <span class="text-[9px] text-gray-400 font-mono">{{ u.submittedAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>

              <div class="text-xs text-indigo-600 font-bold flex items-center gap-1.5">
                <mat-icon class="!w-4 !h-4 !text-[14px]">account_circle</mat-icon>
                {{ u.studentName }} ({{ u.studentCode }}) · {{ u.topicTitle }}
              </div>

              @if (u.description) {
                <p class="text-xs text-gray-500">{{ u.description }}</p>
              }

              @if (u.fileName) {
                <a [href]="progressService.getFileUrl(u.publicUrl)" target="_blank"
                  class="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline decoration-indigo-200 underline-offset-4 inline-block">
                  📎 {{ u.fileName }}
                </a>
              }

              @if (u.reviewerComment) {
                <div class="flex gap-1.5 items-start bg-gray-50 rounded-lg px-3 py-2">
                  <span class="text-[10px] text-gray-400 shrink-0">💬</span>
                  <p class="text-[10px] text-gray-500 italic">{{ u.reviewerComment }}</p>
                </div>
              }

              @if (u.status === 'SUBMITTED') {
                <div class="pt-2 border-t border-gray-100 space-y-2">
                  <textarea [id]="'comment-' + u.id" rows="2" placeholder="Nhận xét..."
                    class="app-select w-full !text-xs resize-none"></textarea>
                  <div class="flex gap-2">
                    <button (click)="review(u, 'REVIEWED')" [disabled]="processingId() === u.id"
                      class="app-btn-primary !py-1.5 font-bold text-[10px]">
                      <mat-icon class="!text-sm">check</mat-icon> Đạt
                    </button>
                    <button (click)="review(u, 'NEEDS_REVISION')" [disabled]="processingId() === u.id"
                      class="app-btn-ghost !text-amber-600 hover:!bg-amber-50 !py-1.5 font-bold text-[10px]">
                      <mat-icon class="!text-sm">edit</mat-icon> Cần bổ sung
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ProgressComponent implements OnInit {
  public progressService = inject(ProgressService);
  private snackBar = inject(MatSnackBar);

  updates = signal<ProgressUpdateResponse[]>([]);
  loading = signal(true);
  processingId = signal<string | null>(null);
  activeTab = signal('ALL');

  tabs = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'SUBMITTED', label: 'Chờ nhận xét' },
    { value: 'REVIEWED', label: 'Đã nhận xét' },
    { value: 'NEEDS_REVISION', label: 'Cần bổ sung' }
  ];

  ngOnInit(): void {
    this.loadUpdates();
  }

  loadUpdates(): void {
    this.loading.set(true);
    this.progressService.getAdvisingProgress().subscribe({
      next: (data) => { this.updates.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  countByStatus(status: string): number {
    if (status === 'ALL') return this.updates().length;
    return this.updates().filter(u => u.status === status).length;
  }

  filteredUpdates(): ProgressUpdateResponse[] {
    if (this.activeTab() === 'ALL') return this.updates();
    return this.updates().filter(u => u.status === this.activeTab());
  }

  review(u: ProgressUpdateResponse, status: string): void {
    const comment = (document.getElementById('comment-' + u.id) as HTMLTextAreaElement)?.value?.trim() || '';
    if (status === 'NEEDS_REVISION' && !comment) {
      this.snackBar.open('Vui lòng nhập nhận xét khi yêu cầu bổ sung', 'Đóng', { duration: 3000 });
      return;
    }
    this.processingId.set(u.id);
    this.progressService.reviewProgress(u.id, status, comment).subscribe({
      next: () => {
        this.snackBar.open('Đã nhận xét tiến độ', 'Đóng', { duration: 3000 });
        this.processingId.set(null);
        this.loadUpdates();
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'Có lỗi xảy ra', 'Đóng', { duration: 3000 });
        this.processingId.set(null);
      }
    });
  }
}
