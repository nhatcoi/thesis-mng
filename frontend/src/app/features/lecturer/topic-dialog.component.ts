import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TopicService, Topic, TopicRequest } from '../../core/topic.service';
import { BatchService } from '../../core/batch.service';
import { UserService } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-topic-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatIconModule],
  template: `
    <div class="p-8 italic">
      <div class="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
        <div>
          <h2 class="app-title !text-lg">
            {{ data.topic ? 'Cập nhật Đề tài' : 'Đề xuất Đề tài' }}
          </h2>
          <p class="app-subtitle italic">Khai báo thông tin chi tiết đề tài đồ án học kỳ.</p>
        </div>
        <button (click)="onCancel()" class="text-gray-400 hover:text-gray-600">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5">Tiêu đề đề tài *</label>
            <input formControlName="title" type="text" class="app-input" placeholder="VD: Xây dựng hệ thống quản lý học tập...">
            @if (form.get('title')?.invalid && form.get('title')?.touched) {
              <p class="text-[9px] text-red-500 mt-1 font-bold italic uppercase">Tiêu đề không được để trống</p>
            }
          </div>

          <div class="col-span-1">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5">Đợt đồ án *</label>
            <select formControlName="batchId" class="app-select">
              <option value="">Chọn đợt đồ án</option>
              @for (batch of batches(); track batch.id) {
                <option [value]="batch.id">{{ batch.name }}</option>
              }
            </select>
          </div>

          <div class="col-span-1">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5">Ngành học áp dụng</label>
            <select formControlName="majorCode" class="app-select">
              <option value="">Cả Khoa (Chung)</option>
              @for (major of majors(); track major.id) {
                <option [value]="major.code">{{ major.name }}</option>
              }
            </select>
          </div>

          <div class="col-span-1">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5">Số lượng SV tối đa *</label>
            <input formControlName="maxStudents" type="number" min="1" max="10" class="app-input" />
            @if (form.get('maxStudents')?.invalid && form.get('maxStudents')?.touched) {
              <p class="text-[9px] text-red-500 mt-1 font-bold italic uppercase">Tối đa 10 sinh viên</p>
            }
          </div>

          <div class="col-span-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5">Mô tả tóm tắt nội dung</label>
            <textarea formControlName="description" rows="3" class="app-input" placeholder="Mô tả sơ lược về đề tài..."></textarea>
          </div>

          <div class="col-span-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5">Yêu cầu chuyên môn (Kỹ năng)</label>
            <textarea formControlName="requirements" rows="2" class="app-input" placeholder="VD: Thành thạo Angular, Spring Boot..."></textarea>
          </div>
        </div>
 
        @if (errorMessage()) {
          <div class="p-3 bg-red-50 text-red-600 rounded text-xs italic font-bold border border-red-100">
            <mat-icon class="!text-sm align-middle mr-1">error_outline</mat-icon> {{ errorMessage() }}
          </div>
        }
 
        <div class="flex justify-end gap-2 pt-6 border-t border-gray-50">
          <button type="button" (click)="onCancel()" class="px-4 py-2 text-xs font-bold text-gray-400 hover:bg-gray-50 rounded italic transition-all">Hủy</button>
          <button type="submit" [disabled]="form.invalid || submitting()" class="app-btn-primary !px-8">
            {{ submitting() ? 'Đang xử lý...' : (data.topic ? 'Lưu thông tin' : 'Đề xuất đề tài') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class TopicDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private topicService = inject(TopicService);
  private batchService = inject(BatchService);
  private userService = inject(UserService);
  private auth = inject(AuthService);

  form: FormGroup;
  batches = signal<any[]>([]);
  majors = signal<any[]>([]);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    public dialogRef: MatDialogRef<TopicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { topic?: Topic }
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      requirements: [''],
      maxStudents: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      batchId: ['', [Validators.required]],
      majorCode: ['']
    });

    if (data.topic) {
      this.form.patchValue({
        title: data.topic.title,
        description: data.topic.description,
        requirements: data.topic.requirements,
        maxStudents: data.topic.maxStudents,
        batchId: data.topic.batchId,
        majorCode: data.topic.majorCode || ''
      });
    }
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    // Load active batches
    this.batchService.listBatches({ status: 'ACTIVE' }).subscribe(res => {
      this.batches.set(res.content);
      // If creating and no batch selected, pick first active one
      if (!this.data.topic && res.content.length > 0 && !this.form.get('batchId')?.value) {
        this.form.patchValue({ batchId: res.content[0].id });
      }
    });

    // Load majors of current faculty
    this.userService.getMajors().subscribe(res => {
      // Filter majors by current user's faculty if possible, 
      // but getMajors currently returns all.
      // For now show all, we can refine later.
      this.majors.set(res);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting.set(true);
    const request: TopicRequest = this.form.value;

    if (this.data.topic) {
      this.topicService.updateTopic(this.data.topic.id, request).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(err?.error?.message || 'Có lỗi xảy ra khi cập nhật đề tài.');
        }
      });
    } else {
      this.topicService.createTopic(request).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(err?.error?.message || 'Có lỗi xảy ra khi tạo đề tài.');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
