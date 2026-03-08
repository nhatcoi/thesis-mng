import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OutlineService, OutlineResponse } from '../../core/outline.service';

@Component({
  selector: 'app-lecturer-outlines',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto">
      <div class="app-section-header">
        <h2 class="app-title">Duyệt đề cương sinh viên</h2>
        <p class="app-subtitle">Xem xét và phê duyệt đề cương đồ án của sinh viên bạn hướng dẫn.</p>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      } @else if (outlines().length === 0) {
        <div class="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <mat-icon class="text-gray-300 !text-[32px]">assignment_late</mat-icon>
          </div>
          <h3 class="text-sm font-bold text-gray-900">Không có đề cương nào</h3>
          <p class="text-xs text-gray-500 mt-1">Hiện chưa có sinh viên nào nộp đề cương.</p>
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
          @for (o of filteredOutlines(); track o.id) {
            <div class="app-card !p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div class="flex flex-col lg:flex-row">
                <!-- Outline Info -->
                <div class="flex-grow p-6 space-y-3">
                  <div class="flex items-center gap-3">
                    <span class="app-badge !px-2.5 !py-1 !font-black !text-[10px]"
                      [class]="o.status === 'APPROVED' ? '!bg-emerald-50 !text-emerald-600 !border-emerald-100' : o.status === 'REJECTED' ? '!bg-red-50 !text-red-600 !border-red-100' : '!bg-amber-50 !text-amber-600 !border-amber-100'">
                      {{ o.status === 'SUBMITTED' ? 'CHỜ DUYỆT' : o.status === 'APPROVED' ? 'ĐÃ DUYỆT' : 'TỪ CHỐI' }}
                    </span>
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      v{{ o.version }} · {{ o.submittedAt | date:'dd/MM/yyyy HH:mm' }}
                    </span>
                  </div>

                  <div>
                    <h3 class="text-sm font-black text-gray-900 leading-tight mb-1">{{ o.topicTitle || 'Chưa có đề tài' }}</h3>
                    <div class="flex items-center gap-2 text-[11px] font-bold text-indigo-600">
                      <mat-icon class="!w-4 !h-4 !text-[16px]">account_circle</mat-icon>
                      <span>{{ o.studentName }} ({{ o.studentCode }})</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <a [href]="outlineService.getFileUrl(o.publicUrl)" target="_blank"
                       class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4 flex items-center gap-1.5">
                      <mat-icon class="!w-4 !h-4 !text-[14px]">picture_as_pdf</mat-icon>
                      {{ o.fileName }}
                    </a>
                    <span class="text-[10px] text-gray-400">({{ formatSize(o.fileSize) }})</span>
                  </div>

                  @if (o.reviewerComment) {
                    <div class="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nhận xét</p>
                      <p class="text-xs text-gray-600">{{ o.reviewerComment }}</p>
                    </div>
                  }
                </div>

                <!-- Actions -->
                @if (o.status === 'SUBMITTED') {
                  <div class="lg:w-72 shrink-0 bg-gray-50/80 p-6 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col justify-center">
                    <div class="space-y-3">
                      <div>
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Nhận xét (tuỳ chọn)</label>
                        <textarea [id]="'comment-' + o.id" rows="3" placeholder="Nhận xét cho sinh viên..."
                          class="app-select w-full !text-xs font-medium border-gray-200 resize-none"></textarea>
                      </div>
                      <div class="flex gap-2">
                        <button (click)="approve(o)"
                          [disabled]="processingId() === o.id"
                          class="app-btn-primary flex-1 justify-center !py-2 font-black uppercase tracking-widest text-[10px]">
                          @if (processingId() === o.id && processingAction() === 'approve') {
                            <div class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          } @else {
                            <mat-icon class="!text-sm">check</mat-icon> Duyệt
                          }
                        </button>
                        <button (click)="reject(o)"
                          [disabled]="processingId() === o.id"
                          class="app-btn-ghost flex-1 justify-center !text-red-500 hover:!bg-red-50 !py-2 font-black uppercase tracking-widest text-[10px]">
                          @if (processingId() === o.id && processingAction() === 'reject') {
                            <div class="w-3 h-3 border-2 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
                          } @else {
                            <mat-icon class="!text-sm">close</mat-icon> Từ chối
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class OutlinesComponent implements OnInit {
  public outlineService = inject(OutlineService);
  private snackBar = inject(MatSnackBar);

  outlines = signal<OutlineResponse[]>([]);
  loading = signal(true);
  processingId = signal<string | null>(null);
  processingAction = signal<string>('');
  activeTab = signal('ALL');

  tabs = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'SUBMITTED', label: 'Chờ duyệt' },
    { value: 'APPROVED', label: 'Đã duyệt' },
    { value: 'REJECTED', label: 'Từ chối' }
  ];

  ngOnInit(): void {
    this.loadOutlines();
  }

  loadOutlines(): void {
    this.loading.set(true);
    this.outlineService.getAdvisingOutlines().subscribe({
      next: (data) => {
        this.outlines.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  countByStatus(status: string): number {
    if (status === 'ALL') return this.outlines().length;
    return this.outlines().filter(o => o.status === status).length;
  }

  filteredOutlines(): OutlineResponse[] {
    if (this.activeTab() === 'ALL') return this.outlines();
    return this.outlines().filter(o => o.status === this.activeTab());
  }

  approve(o: OutlineResponse): void {
    this.processingId.set(o.id);
    this.processingAction.set('approve');
    const comment = this.getComment(o.id);

    this.outlineService.reviewOutline(o.id, 'APPROVED', comment).subscribe({
      next: () => {
        this.snackBar.open('Đã duyệt đề cương', 'Đóng', { duration: 3000 });
        this.processingId.set(null);
        this.loadOutlines();
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'Có lỗi xảy ra', 'Đóng', { duration: 3000 });
        this.processingId.set(null);
      }
    });
  }

  reject(o: OutlineResponse): void {
    const comment = this.getComment(o.id);
    if (!comment) {
      this.snackBar.open('Vui lòng nhập nhận xét khi từ chối', 'Đóng', { duration: 3000 });
      return;
    }
    this.processingId.set(o.id);
    this.processingAction.set('reject');

    this.outlineService.reviewOutline(o.id, 'REJECTED', comment).subscribe({
      next: () => {
        this.snackBar.open('Đã từ chối đề cương', 'Đóng', { duration: 3000 });
        this.processingId.set(null);
        this.loadOutlines();
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'Có lỗi xảy ra', 'Đóng', { duration: 3000 });
        this.processingId.set(null);
      }
    });
  }

  private getComment(outlineId: string): string {
    const el = document.getElementById('comment-' + outlineId) as HTMLTextAreaElement;
    return el?.value?.trim() || '';
  }

  formatSize(bytes: number): string {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
