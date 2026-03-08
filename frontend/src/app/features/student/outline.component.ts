import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThesisService } from '../../core/thesis.service';
import { OutlineService, OutlineResponse } from '../../core/outline.service';

@Component({
  selector: 'app-student-outline',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="app-section-header">
        <h2 class="app-title">
          @if (batchName()) {
            Nộp đề cương — <span class="text-indigo-600">{{ batchName() }}</span>
          } @else {
            Nộp đề cương đồ án
          }
        </h2>
        <p class="app-subtitle italic flex flex-wrap items-center gap-x-4 gap-y-1">
          @if (batchName()) {
            <span>Nộp đề cương cho đề tài đã được phê duyệt.</span>
            @if (outlineStart() && outlineEnd()) {
              <span class="flex items-center gap-1.5 text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50 font-mono">
                <mat-icon class="!w-3.5 !h-3.5 !text-[14px]">event</mat-icon>
                Giai đoạn: {{ outlineStart() | date:'dd/MM/yyyy HH:mm' }} - {{ outlineEnd() | date:'dd/MM/yyyy HH:mm' }}
              </span>
              @if (isOutlineEnded()) {
                <span class="flex items-center gap-1 text-red-500 font-black uppercase tracking-tighter">
                  <mat-icon class="!w-3.5 !h-3.5 !text-[14px]">alarm_off</mat-icon>
                  (Đã kết thúc)
                </span>
              }
            }
          } @else {
            Bạn cần tham gia đợt ĐATN và được phân công đề tài trước.
          }
        </p>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      } @else if (!batchName()) {
        <!-- No batch -->
        <div class="app-card">
          <div class="p-12 text-center">
            <div class="mx-auto w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
              <mat-icon class="!text-amber-400 !text-[28px]">info</mat-icon>
            </div>
            <h3 class="text-sm font-bold text-gray-900">Chưa tham gia đợt ĐATN</h3>
            <p class="text-xs text-gray-500 mt-1">Liên hệ phòng đào tạo để được gán vào đợt đồ án.</p>
          </div>
        </div>
      } @else if (isOutlineApproved()) {
        <div class="app-card !p-5">
          <div class="flex items-center gap-3 mb-3">
            <mat-icon class="!text-emerald-500 !text-[20px]">check_circle</mat-icon>
            <span class="text-sm font-bold text-gray-900">Đề cương đã được duyệt</span>
          </div>
          @if (topicTitle()) {
            <p class="text-xs text-gray-500">Đề tài: <strong class="text-gray-900">{{ topicTitle() }}</strong></p>
          }
          @if (advisorName()) {
            <p class="text-xs text-gray-500 mt-0.5">GVHD: <strong class="text-gray-900">{{ advisorName() }}</strong></p>
          }
        </div>
      } @else if (!canSubmit()) {
        <!-- Cannot submit yet -->
        <div class="app-card">
          <div class="p-12 text-center">
            <div class="mx-auto w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <mat-icon class="!text-gray-300 !text-[28px]">lock</mat-icon>
            </div>
            <h3 class="text-sm font-bold text-gray-900">Chưa khả dụng</h3>
            <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              @if (isBeforeOutline()) {
                Chưa đến thời gian nộp đề cương. Vui lòng quay lại sau.
              } @else if (isOutlineEnded()) {
                Đã hết hạn nộp đề cương.
              } @else {
                Bạn cần được phân công đề tài trước khi nộp đề cương.<br>
                Trạng thái hiện tại: <strong>{{ thesisStatus() }}</strong>
              }
            </p>
          </div>
        </div>
      } @else {
        <!-- Topic info -->
        @if (topicTitle()) {
          <div class="app-card !p-5">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                <mat-icon class="!text-white !text-[18px]">description</mat-icon>
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Đề tài của bạn</p>
                <p class="text-sm font-bold text-gray-900 truncate">{{ topicTitle() }}</p>
                @if (advisorName()) {
                  <p class="text-xs text-gray-500 mt-0.5">GVHD: <strong class="text-indigo-600">{{ advisorName() }}</strong></p>
                }
              </div>
            </div>
          </div>
        }

        <!-- Upload area -->
        <div class="app-card !p-0 overflow-hidden">
          <div class="p-6 lg:p-8">
            <div class="flex items-center gap-2 mb-5">
              <mat-icon class="!text-indigo-500 !text-[20px]">upload_file</mat-icon>
              <h3 class="text-sm font-black text-gray-900 uppercase tracking-tight">Nộp đề cương mới</h3>
            </div>
            
            <div 
              (drop)="onDrop($event)" 
              (dragover)="onDragOver($event)"
              (dragleave)="dragActive.set(false)"
              [class]="dragActive() ? 'upload-zone upload-zone-active' : 'upload-zone'"
              (click)="fileInput.click()">
              <input #fileInput type="file" accept=".pdf" class="hidden" (change)="onFileSelected($event)">
              @if (selectedFile()) {
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <mat-icon class="!text-red-500 !text-[20px]">picture_as_pdf</mat-icon>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-gray-900 truncate">{{ selectedFile()!.name }}</p>
                    <p class="text-[10px] text-gray-400">{{ formatSize(selectedFile()!.size) }}</p>
                  </div>
                  <button (click)="clearFile($event)" class="ml-auto p-1 hover:bg-red-50 rounded-lg transition-colors">
                    <mat-icon class="!text-gray-400 hover:!text-red-500 !text-[18px]">close</mat-icon>
                  </button>
                </div>
              } @else {
                <mat-icon class="!text-gray-300 !text-[40px] mb-3">cloud_upload</mat-icon>
                <p class="text-sm font-bold text-gray-600">Kéo thả file PDF hoặc <span class="text-indigo-600">nhấn để chọn</span></p>
                <p class="text-[10px] text-gray-400 mt-1">Chỉ chấp nhận file PDF, tối đa 10MB</p>
              }
            </div>

            <div class="mt-5 flex justify-end">
              <button 
                (click)="submitOutline()"
                [disabled]="!selectedFile() || submitting()"
                class="app-btn-primary !py-2.5 font-black uppercase tracking-widest text-[11px]"
                [class.opacity-50]="!selectedFile()">
                @if (submitting()) {
                  <div class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang tải lên...
                } @else {
                  <mat-icon class="!text-sm">upload</mat-icon>
                  Nộp đề cương
                }
              </button>
            </div>
          </div>
        </div>
        }

      <!-- History — always show when outlines exist -->
      @if (!loading() && outlines().length > 0) {
        <div class="app-card !p-0 overflow-hidden">
          <div class="p-6 lg:p-8 pb-2">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <mat-icon class="!text-gray-400 !text-[18px]">history</mat-icon>
              Lịch sử nộp đề cương
            </h3>
          </div>
          <div class="divide-y divide-gray-50">
            @for (o of outlines(); track o.id) {
              <div class="px-6 lg:px-8 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div class="flex items-center gap-4 min-w-0">
                  <div class="w-2 h-2 rounded-full shrink-0"
                    [class]="o.status === 'APPROVED' ? 'bg-emerald-500' : o.status === 'REJECTED' ? 'bg-red-500' : 'bg-amber-500'">
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                       <span class="text-xs font-black text-gray-900">v{{ o.version }}</span>
                       <a [href]="outlineService.getFileUrl(o.publicUrl)" target="_blank"
                          class="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline decoration-indigo-200 underline-offset-4 truncate">
                         {{ o.fileName }}
                       </a>
                    </div>
                    @if (o.reviewerComment) {
                      <div class="mt-1 flex gap-1.5 items-start">
                        <span class="text-[10px] text-gray-400 mt-0.5 shrink-0">💬</span>
                        <p class="text-[10px] text-gray-500 italic">{{ o.reviewerComment }}</p>
                      </div>
                    }
                  </div>
                </div>

                <div class="text-right shrink-0">
                   <p class="text-[10px] font-black uppercase tracking-widest"
                     [class]="o.status === 'APPROVED' ? 'text-emerald-600' : o.status === 'REJECTED' ? 'text-red-600' : 'text-amber-600'">
                     {{ o.status === 'SUBMITTED' ? 'Chờ duyệt' : o.status === 'APPROVED' ? 'Đã duyệt' : 'Bị từ chối' }}
                   </p>
                   <p class="text-[9px] text-gray-400 font-mono mt-0.5">{{ o.submittedAt | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .upload-zone {
      border: 2px dashed #e5e7eb;
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 120px;
    }
    .upload-zone:hover {
      border-color: #c7d2fe;
      background: #f5f3ff;
    }
    .upload-zone-active {
      border-color: #818cf8;
      background: #eef2ff;
    }
  `]
})
export class OutlineComponent implements OnInit {
  private thesisService = inject(ThesisService);
  public outlineService = inject(OutlineService);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  batchName = signal('');
  outlineStart = signal('');
  outlineEnd = signal('');
  thesisStatus = signal('');
  topicTitle = signal('');
  advisorName = signal('');

  outlines = signal<OutlineResponse[]>([]);
  selectedFile = signal<File | null>(null);
  submitting = signal(false);
  dragActive = signal(false);

  ngOnInit(): void {
    this.thesisService.getMyActiveBatch().subscribe({
      next: (batch) => {
        if (batch) {
          this.batchName.set(batch.batchName);
          this.outlineStart.set(batch.outlineStart);
          this.outlineEnd.set(batch.outlineEnd);
          this.thesisStatus.set(batch.thesisStatus || '');
          this.topicTitle.set(batch.topicTitle || '');
          this.advisorName.set(batch.advisorName || '');
        }
        this.loading.set(false);
        if (batch) this.loadOutlines();
      },
      error: () => this.loading.set(false)
    });
  }

  loadOutlines(): void {
    this.outlineService.getMyOutlines().subscribe({
      next: (data) => this.outlines.set(data)
    });
  }

  isOutlineApproved(): boolean {
    return this.thesisStatus() === 'OUTLINE_APPROVED';
  }

  canSubmit(): boolean {
    const status = this.thesisStatus();
    const validStatuses = ['TOPIC_ASSIGNED', 'OUTLINE_SUBMITTED', 'OUTLINE_REJECTED'];
    return validStatuses.includes(status) && !this.isBeforeOutline() && !this.isOutlineEnded();
  }

  isBeforeOutline(): boolean {
    if (!this.outlineStart()) return false;
    return new Date() < new Date(this.outlineStart());
  }

  isOutlineEnded(): boolean {
    if (!this.outlineEnd()) return false;
    return new Date() > new Date(this.outlineEnd());
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActive.set(false);
    if (event.dataTransfer?.files.length) {
      this.validateAndSetFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragActive.set(true);
  }

  private validateAndSetFile(file: File): void {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.snackBar.open('Chỉ chấp nhận file PDF', 'Đóng', { duration: 3000 });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.snackBar.open('File quá lớn. Tối đa 10MB', 'Đóng', { duration: 3000 });
      return;
    }
    this.selectedFile.set(file);
  }

  clearFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile.set(null);
  }

  submitOutline(): void {
    const file = this.selectedFile();
    if (!file) return;
    this.submitting.set(true);

    this.outlineService.submitOutline(file).subscribe({
      next: () => {
        this.submitting.set(false);
        this.selectedFile.set(null);
        this.snackBar.open('Nộp đề cương thành công!', 'Đóng', { duration: 3000 });
        this.loadOutlines();
        // Refresh thesis status
        this.thesisService.getMyActiveBatch().subscribe({
          next: (batch) => {
            if (batch) this.thesisStatus.set(batch.thesisStatus || '');
          }
        });
      },
      error: (err: any) => {
        this.submitting.set(false);
        this.snackBar.open(err.error?.message || 'Nộp đề cương thất bại', 'Đóng', { duration: 4000 });
      }
    });
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
