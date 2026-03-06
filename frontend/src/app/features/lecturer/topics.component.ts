import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TopicService, Topic } from '../../core/topic.service';
import { TopicDialogComponent } from './topic-dialog.component';
import { TopicDetailDialogComponent } from './topic-detail-dialog.component';
import { BatchService } from '../../core/batch.service';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-lecturer-topics',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, MatSnackBarModule, FormsModule],
  template: `
    <div class="space-y-4">
      <!-- Header -->
      <div class="app-section-header flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 class="app-title">Quản lý đề tài của tôi</h2>
          <p class="app-subtitle">Đề xuất và quản lý các đề tài đồ án bạn hướng dẫn.</p>
        </div>
        <button (click)="openTopicDialog()" class="app-btn-primary">
          <mat-icon class="mr-1.5 !text-base">add</mat-icon> Tạo đề tài mới
        </button>
      </div>

      <!-- Filters -->
      <div class="app-card p-3 flex flex-wrap gap-2 items-center">
        <div class="relative flex-grow min-w-[200px]">
          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 !text-base text-gray-400">search</mat-icon>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onFilterChange()"
            placeholder="Tìm đề tài..." class="app-input pl-9" />
        </div>

        <select [(ngModel)]="selectedBatch" (ngModelChange)="onFilterChange()" class="app-select min-w-[150px]">
          <option value="">Tất cả đợt</option>
          @for (batch of batches(); track batch.id) {
            <option [value]="batch.id">{{ batch.name }}</option>
          }
        </select>

        <select [(ngModel)]="selectedStatus" (ngModelChange)="onFilterChange()" class="app-select min-w-[130px]">
          <option value="">Trạng thái</option>
          <option value="AVAILABLE">Sẵn sàng</option>
          <option value="FULL">Đã đầy</option>
          <option value="CLOSED">Đã đóng</option>
          <option value="REJECTED">Bị từ chối</option>
        </select>

        <select [(ngModel)]="selectedMajor" (ngModelChange)="onFilterChange()" class="app-select min-w-[150px]">
          <option value="">Ngành học</option>
          @for (major of majors(); track major.id) {
            <option [value]="major.code">{{ major.name }}</option>
          }
        </select>

        <button (click)="resetFilters()" class="app-btn-ghost" title="Đặt lại">
          <mat-icon class="!text-lg">restart_alt</mat-icon>
        </button>
      </div>

      <!-- Content -->
      @if (loading()) {
        <div class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      } @else if (topics().length === 0) {
        <div class="p-10 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50/30">
          <h3 class="text-sm font-bold text-gray-900">Chưa có đề tài nào</h3>
          <p class="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Hãy bắt đầu bằng cách đề xuất đề tài đồ án đầu tiên của bạn cho sinh viên.</p>
        </div>
      } @else {
        <div class="app-list-container">
          @for (topic of topics(); track topic.id) {
            <div class="app-list-item">
              <div class="flex flex-col sm:flex-row justify-between gap-4">
                <div class="flex-grow min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span [class]="getStatusClass(topic.status)" class="app-badge">{{ getStatusLabel(topic.status) }}</span>
                    <span class="app-badge border-gray-100 bg-gray-50 text-gray-400 lowercase">{{ topic.batchName }}</span>
                  </div>
                  <h3 (click)="viewTopicDetail(topic)" class="text-sm font-bold text-gray-900 leading-snug cursor-pointer hover:text-indigo-600 transition-colors" title="Xem chi tiết">{{ topic.title }}</h3>
                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-gray-500">
                    <span class="flex items-center gap-1"><mat-icon class="!text-xs">groups</mat-icon> {{ topic.currentStudents }}/{{ topic.maxStudents }} SV</span>
                    @if (topic.majorName) {
                      <span class="flex items-center gap-1"><mat-icon class="!text-xs">school</mat-icon> {{ topic.majorName }}</span>
                    }
                    <span>• Ngày tạo: {{ topic.createdAt | date:'dd/MM/yyyy' }}</span>
                  </div>
                  @if (topic.status === 'REJECTED' && topic.rejectReason) {
                    <div class="mt-2 bg-rose-50 p-2 rounded border border-rose-100 text-[11px] text-rose-700 italic">
                      Lý do từ chối: {{ topic.rejectReason }}
                    </div>
                  }
                </div>

                <div class="flex sm:flex-col items-center sm:items-end justify-center gap-1 shrink-0">
                  <div class="flex gap-1">
                    @if (topic.status === 'AVAILABLE' || topic.status === 'FULL') {
                      <button (click)="closeTopic(topic.id)" class="app-btn-ghost text-amber-500" title="Đóng đề tài">
                        <mat-icon class="!text-lg">lock_outline</mat-icon>
                      </button>
                    } @else if (topic.status === 'CLOSED') {
                      <button (click)="reopenTopic(topic.id)" class="app-btn-ghost text-emerald-500" title="Mở lại đề tài">
                        <mat-icon class="!text-lg">lock_open</mat-icon>
                      </button>
                    }
                    @if (canEdit(topic)) {
                      <button (click)="openTopicDialog(topic)" class="app-btn-ghost text-indigo-500" title="Sửa">
                        <mat-icon class="!text-lg">edit</mat-icon>
                      </button>
                    }
                    @if (topic.status !== 'CLOSED' && topic.currentStudents === 0) {
                      <button (click)="confirmDelete(topic)" class="app-btn-ghost text-rose-500" title="Xóa">
                        <mat-icon class="!text-lg">delete</mat-icon>
                      </button>
                    }
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
  private topicService = inject(TopicService);
  private batchService = inject(BatchService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  topics = signal<Topic[]>([]);
  loading = signal(true);

  // Filters
  searchQuery = '';
  selectedBatch = '';
  selectedStatus = '';
  selectedMajor = '';

  batches = signal<any[]>([]);
  majors = signal<any[]>([]);

  ngOnInit(): void {
    this.loadInitialData();
    this.loadTopics();
  }

  loadInitialData(): void {
    this.batchService.listBatches({ status: 'ACTIVE' }).subscribe((res: any) => {
      this.batches.set(res.content);
    });
    this.userService.getMajors().subscribe((res: any) => {
      this.majors.set(res);
    });
  }

  loadTopics(): void {
    this.loading.set(true);
    this.topicService.getMyTopics({
      page: 0,
      size: 50,
      search: this.searchQuery || undefined,
      status: this.selectedStatus || undefined,
      batchId: this.selectedBatch || undefined,
      majorCode: this.selectedMajor || undefined
    }).subscribe({
      next: (res: any) => {
        this.topics.set(res.data.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onFilterChange(): void {
    this.loadTopics();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedBatch = '';
    this.selectedStatus = '';
    this.selectedMajor = '';
    this.loadTopics();
  }

  openTopicDialog(topic?: Topic): void {
    const dialogRef = this.dialog.open(TopicDialogComponent, {
      width: '600px',
      data: { topic },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTopics();
        this.snackBar.open(topic ? 'Đã cập nhật đề tài' : 'Đã tạo đề tài mới', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  confirmDelete(topic: Topic): void {
    if (confirm(`Bạn có chắc muốn xóa đề tài "${topic.title}"?`)) {
      this.topicService.deleteTopic(topic.id).subscribe({
        next: () => {
          this.loadTopics();
          this.snackBar.open('Đã xóa đề tài', 'Đóng', { duration: 3000 });
        },
        error: (err: any) => {
          this.snackBar.open(err.error?.message || 'Không thể xóa đề tài', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  closeTopic(id: string): void {
    if (confirm('Bạn có chắc muốn đóng đề tài này? Sinh viên sẽ không thể đăng ký thêm.')) {
      this.topicService.closeTopic(id).subscribe({
        next: () => {
          this.loadTopics();
          this.snackBar.open('Đã đóng đề tài', 'Đóng', { duration: 3000 });
        },
        error: (err: any) => {
          this.snackBar.open(err.error?.message || 'Không thể đóng đề tài', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  reopenTopic(id: string): void {
    this.topicService.reopenTopic(id).subscribe({
      next: () => {
        this.loadTopics();
        this.snackBar.open('Đã mở lại đề tài', 'Đóng', { duration: 3000 });
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'Không thể mở lại đề tài', 'Đóng', { duration: 3000 });
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'Sẵn sàng';
      case 'PENDING_APPROVAL': return 'Chờ duyệt';
      case 'APPROVED': return 'Đã duyệt';
      case 'REJECTED': return 'Từ chối';
      case 'FULL': return 'Đã đầy';
      case 'CLOSED': return 'Đã đóng';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'PENDING_APPROVAL': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'APPROVED': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'FULL': return 'bg-gray-50 text-gray-500 border border-gray-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  }

  viewTopicDetail(topic: Topic): void {
    this.dialog.open(TopicDetailDialogComponent, {
      width: '720px',
      maxHeight: '90vh',
      data: { topicId: topic.id },
      autoFocus: false
    });
  }

  canEdit(topic: Topic): boolean {
    // Lecturers can edit if not closed
    return topic.status !== 'CLOSED';
  }
}
