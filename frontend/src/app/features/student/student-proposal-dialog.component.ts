import { Component, OnInit, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TopicRegistrationService, StudentTopicProposal } from '../../core/topic-registration.service';
import { BatchService } from '../../core/batch.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-student-proposal-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule],
  template: `
    <div class="proposal-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <div>
          <h2 class="dialog-title">Đề xuất đề tài mới</h2>
          <p class="dialog-subtitle">Mô tả đề tài bạn muốn thực hiện. Hệ thống sẽ gửi yêu cầu duyệt.</p>
        </div>
        <button (click)="onCancel()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-body">
        <!-- Batch selection -->
        <div class="form-group">
          <label class="form-label">Đợt đồ án <span class="required">*</span></label>
          <select [(ngModel)]="form.batchId" class="app-select w-full">
            <option value="">-- Chọn đợt đồ án --</option>
            @for (batch of batches(); track batch.id) {
              <option [value]="batch.id">{{ batch.name }}</option>
            }
          </select>
        </div>

        <!-- Title -->
        <div class="form-group">
          <label class="form-label">Tên đề tài <span class="required">*</span></label>
          <input type="text" [(ngModel)]="form.title"
            placeholder="Nhập tên đề tài đề xuất..."
            class="app-input w-full" />
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="form-label">Mô tả chi tiết</label>
          <textarea [(ngModel)]="form.description"
            placeholder="Mô tả nội dung, phạm vi, mục tiêu đề tài..."
            rows="4"
            class="app-input w-full resize-y"></textarea>
        </div>

        <!-- Requirements -->
        <div class="form-group">
          <label class="form-label">Yêu cầu / Công nghệ dự kiến</label>
          <textarea [(ngModel)]="form.requirements"
            placeholder="Công nghệ, framework, ngôn ngữ dự kiến sử dụng..."
            rows="2"
            class="app-input w-full resize-y"></textarea>
        </div>

        <!-- Preferred Lecturer toggle -->
        <div class="form-group">
          <label class="form-label">Giảng viên hướng dẫn mong muốn</label>
          <div class="lecturer-toggle">
            <button (click)="wantLecturer.set(false)"
              [class]="!wantLecturer() ? 'toggle-btn toggle-active' : 'toggle-btn toggle-inactive'">
              <mat-icon class="!text-sm">shuffle</mat-icon>
              Để Trưởng ngành phân công
            </button>
            <button (click)="wantLecturer.set(true)"
              [class]="wantLecturer() ? 'toggle-btn toggle-active' : 'toggle-btn toggle-inactive'">
              <mat-icon class="!text-sm">person_search</mat-icon>
              Chỉ định giảng viên
            </button>
          </div>
        </div>

        @if (wantLecturer()) {
          <div class="form-group">
            <label class="form-label">Tìm giảng viên</label>
            <div class="relative">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 !text-base text-gray-400">search</mat-icon>
              <input type="text"
                [(ngModel)]="lecturerSearch"
                (input)="filterLecturers()"
                placeholder="Tìm theo tên GV..."
                class="app-input pl-9 w-full" />
            </div>
            <div class="lecturer-list">
              @if (filteredLecturers().length === 0) {
                <p class="text-xs text-gray-400 text-center py-3">Không tìm thấy giảng viên.</p>
              }
              @for (lec of filteredLecturers(); track lec.id) {
                <div (click)="selectLecturer(lec)"
                  [class.selected]="form.preferredLecturerId === lec.id"
                  class="lecturer-item">
                  <div class="lec-avatar">
                    <mat-icon>person</mat-icon>
                  </div>
                  <div class="flex-grow min-w-0">
                    <p class="text-xs font-bold text-gray-900">{{ lec.lastName }} {{ lec.firstName }}</p>
                    <p class="text-[10px] text-gray-400">{{ lec.email }}</p>
                    @if (lec.facultyName) {
                      <p class="text-[10px] text-gray-400">{{ lec.facultyName }}</p>
                    }
                  </div>
                  @if (form.preferredLecturerId === lec.id) {
                    <mat-icon class="text-indigo-600 !text-base">check_circle</mat-icon>
                  }
                </div>
              }
            </div>
          </div>
        }

        @if (!wantLecturer()) {
          <div class="info-banner">
            <mat-icon class="!text-base text-blue-500">info</mat-icon>
            <p>Đề tài sẽ được gửi lên <strong>Trưởng ngành</strong> để xem xét và phân công giảng viên hướng dẫn phù hợp.</p>
          </div>
        }
      </div>

      <!-- Footer -->
      <div class="dialog-footer">
        <button (click)="onCancel()" class="app-btn-secondary">Hủy</button>
        <button (click)="onSubmit()" [disabled]="submitting() || !isValid()" class="app-btn-primary">
          @if (submitting()) {
            <div class="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
          }
          {{ submitting() ? 'Đang gửi...' : 'Gửi đề xuất' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .proposal-dialog {
      display: flex;
      flex-direction: column;
      max-height: 85vh;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px 24px 12px;
      border-bottom: 1px solid #f3f4f6;
    }
    .dialog-title {
      font-size: 16px;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.02em;
    }
    .dialog-subtitle {
      font-size: 11px;
      color: #9ca3af;
      margin-top: 2px;
    }
    .close-btn {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      transition: all 0.15s;
    }
    .close-btn:hover {
      color: #374151;
      background: #f3f4f6;
    }

    .dialog-body {
      padding: 16px 24px;
      overflow-y: auto;
      flex: 1;
    }

    .form-group {
      margin-bottom: 14px;
    }
    .form-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 5px;
    }
    .required {
      color: #ef4444;
    }

    /* Lecturer toggle */
    .lecturer-toggle {
      display: flex;
      gap: 6px;
    }
    .toggle-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      cursor: pointer;
      transition: all 0.15s;
      flex: 1;
      justify-content: center;
    }
    .toggle-active {
      background: #eef2ff;
      border-color: #c7d2fe;
      color: #4338ca;
    }
    .toggle-inactive {
      background: white;
      border-color: #e5e7eb;
      color: #6b7280;
    }
    .toggle-inactive:hover {
      background: #f9fafb;
    }

    /* Lecturer list */
    .lecturer-list {
      max-height: 180px;
      overflow-y: auto;
      border: 1px solid #f3f4f6;
      border-radius: 8px;
      margin-top: 6px;
    }
    .lecturer-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      cursor: pointer;
      transition: all 0.1s;
      border-bottom: 1px solid #f9fafb;
    }
    .lecturer-item:last-child {
      border-bottom: none;
    }
    .lecturer-item:hover {
      background: #f9fafb;
    }
    .lecturer-item.selected {
      background: #eef2ff;
      border-color: #e0e7ff;
    }
    .lec-avatar {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }
    .lec-avatar mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Info banner */
    .info-banner {
      display: flex;
      gap: 8px;
      padding: 10px 14px;
      background: #eff6ff;
      border-radius: 8px;
      border: 1px solid #dbeafe;
      margin-top: 4px;
    }
    .info-banner p {
      font-size: 11px;
      color: #1e40af;
      line-height: 1.5;
      margin: 0;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 24px;
      border-top: 1px solid #f3f4f6;
    }
  `]
})
export class StudentProposalDialogComponent implements OnInit {
  private regService = inject(TopicRegistrationService);
  private batchService = inject(BatchService);
  private http = inject(HttpClient);

  batches = signal<any[]>([]);
  lecturers = signal<any[]>([]);
  filteredLecturers = signal<any[]>([]);
  wantLecturer = signal(false);
  submitting = signal(false);
  lecturerSearch = '';

  form: StudentTopicProposal & { preferredLecturerId?: string } = {
    title: '',
    description: '',
    requirements: '',
    batchId: '',
    preferredLecturerId: undefined
  };

  constructor(
    public dialogRef: MatDialogRef<StudentProposalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.loadBatches();
    this.loadLecturers();
  }

  loadBatches(): void {
    this.batchService.listBatches({ status: 'ACTIVE', size: 100 }).subscribe({
      next: (res: any) => {
        const data = res?.content || res || [];
        this.batches.set(Array.isArray(data) ? data : []);
        // Auto-select if only one active batch
        if (this.batches().length === 1) {
          this.form.batchId = this.batches()[0].id;
        }
      }
    });
  }

  loadLecturers(): void {
    this.http.get<any>(`${environment.apiUrl}/lecturers`).subscribe({
      next: (res: any) => {
        const list = res?.data || res || [];
        this.lecturers.set(Array.isArray(list) ? list : []);
        this.filteredLecturers.set(this.lecturers());
      }
    });
  }

  filterLecturers(): void {
    const q = this.lecturerSearch.toLowerCase().trim();
    if (!q) {
      this.filteredLecturers.set(this.lecturers());
      return;
    }
    this.filteredLecturers.set(
      this.lecturers().filter(l =>
        `${l.lastName} ${l.firstName}`.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q))
      )
    );
  }

  selectLecturer(lec: any): void {
    if (this.form.preferredLecturerId === lec.id) {
      this.form.preferredLecturerId = undefined; // deselect
    } else {
      this.form.preferredLecturerId = lec.id;
    }
  }

  isValid(): boolean {
    return !!(this.form.title?.trim() && this.form.batchId);
  }

  onSubmit(): void {
    if (!this.isValid()) return;
    this.submitting.set(true);

    const payload: StudentTopicProposal = {
      title: this.form.title.trim(),
      description: this.form.description?.trim() || undefined,
      requirements: this.form.requirements?.trim() || undefined,
      batchId: this.form.batchId,
      preferredLecturerId: this.wantLecturer() ? this.form.preferredLecturerId : undefined
    };

    this.regService.proposeTopic(payload).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.submitting.set(false);
        // Re-throw so the parent can handle with snackbar
        this.dialogRef.close({ error: err?.error?.message || 'Đề xuất thất bại.' });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
