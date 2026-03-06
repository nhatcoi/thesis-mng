import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TopicService, Topic } from '../../core/topic.service';
import { TopicRegistrationService, TopicRegistration } from '../../core/topic-registration.service';
import { BatchService } from '../../core/batch.service';

@Component({
  selector: 'app-student-topics',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="space-y-4">
      <!-- Header -->
      <div class="app-section-header">
        <h2 class="app-title">Đăng ký đề tài</h2>
        <p class="app-subtitle">Tìm kiếm và đăng ký đề tài đồ án tốt nghiệp từ danh sách các đề tài có sẵn.</p>
      </div>

      <!-- Tabs & Content -->
      <div class="app-card">
        <div class="app-tabs">
          <button (click)="activeTab.set('available')"
            [class]="activeTab() === 'available' ? 'app-tab-btn-active' : 'app-tab-btn-inactive'"
            class="app-tab-btn">
            Đề tài có sẵn
          </button>
          <button (click)="activeTab.set('my')"
            [class]="activeTab() === 'my' ? 'app-tab-btn-active' : 'app-tab-btn-inactive'"
            class="app-tab-btn">
            Yêu cầu đã gửi
            @if (myRegistrations().length > 0) {
              <span class="bg-indigo-100 text-indigo-600 text-[10px] px-1.5 rounded">{{ myRegistrations().length }}</span>
            }
          </button>
        </div>

        <!-- Tab: Available Topics -->
        @if (activeTab() === 'available') {
          <div class="p-4">
            <!-- Filters -->
            <div class="flex flex-col md:flex-row gap-2 mb-4">
              <div class="relative flex-grow">
                <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 !text-base text-gray-400">search</mat-icon>
                <input type="text" placeholder="Tìm theo tên đề tài..."
                  [(ngModel)]="searchText"
                  (input)="onSearchChange()"
                  class="app-input pl-9" />
              </div>
              <select [(ngModel)]="selectedBatchId" (change)="loadTopics()" class="app-select min-w-[12rem]">
                <option value="">Tất cả đợt</option>
                @for (batch of batches(); track batch.id) {
                  <option [value]="batch.id">{{ batch.name }}</option>
                }
              </select>
            </div>

            <!-- Topic List -->
            @if (loading()) {
              <div class="flex justify-center py-10">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              </div>
            } @else if (topics().length === 0) {
              <div class="p-10 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50/30">
                <h3 class="text-sm font-bold text-gray-900">Không tìm thấy đề tài</h3>
                <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Hiện chưa có đề tài nào khả dụng hoặc không có đề tài phù hợp với bộ lọc.</p>
              </div>
            } @else {
              <div class="app-list-container">
                @for (topic of topics(); track topic.id) {
                  <div class="app-list-item">
                    <div class="flex flex-col sm:flex-row justify-between gap-4">
                      <div class="flex-grow min-w-0">
                        <h3 class="text-sm font-bold text-gray-900 leading-snug">{{ topic.title }}</h3>
                        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-gray-500">
                          <span class="flex items-center gap-1"><mat-icon class="!text-xs">person</mat-icon> {{ topic.proposedByName }}</span>
                          <span class="font-medium px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{{ topic.batchName }}</span>
                          @if (topic.majorName) {
                            <span class="bg-gray-100 px-1.5 py-0.5 rounded">{{ topic.majorName }}</span>
                          }
                        </div>
                        @if (topic.description) {
                          <p class="text-xs text-gray-500 mt-2 line-clamp-2">{{ topic.description }}</p>
                        }
                        @if (topic.requirements) {
                          <div class="mt-2">
                            <span class="app-badge border-amber-100 bg-amber-50 text-amber-700">YC: {{ topic.requirements }}</span>
                          </div>
                        }
                      </div>

                      <div class="flex flex-col items-end gap-2 shrink-0 sm:min-w-[140px]">
                        @if (getSlotsRemaining(topic) > 0) {
                          <span class="app-badge border-emerald-100 bg-emerald-50 text-emerald-700">Còn {{ getSlotsRemaining(topic) }} chỗ</span>
                        } @else {
                          <span class="app-badge border-gray-200 bg-gray-100 text-gray-500">Hết chỗ</span>
                        }
                        <div class="text-[11px] text-gray-400">{{ topic.currentStudents }}/{{ topic.maxStudents }} SV</div>
                        
                        @if (isAlreadyRegistered(topic.id)) {
                          <button disabled class="app-btn-secondary w-full justify-center !text-gray-400 bg-gray-50">Đã đăng ký</button>
                        } @else if (getSlotsRemaining(topic) > 0) {
                          <button (click)="registerForTopic(topic)" [disabled]="registering()" class="app-btn-primary w-full justify-center">Đăng ký</button>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- Tab: My Registrations -->
        @if (activeTab() === 'my') {
          <div class="p-4">
            @if (loadingRegistrations()) {
              <div class="flex justify-center py-10">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              </div>
            } @else if (myRegistrations().length === 0) {
              <div class="p-10 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50/20">
                <h3 class="text-sm font-bold text-gray-900">Chưa gửi yêu cầu nào</h3>
                <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Hãy chọn đề tài từ tab "Đề tài có sẵn" và nhấn Đăng ký.</p>
              </div>
            } @else {
              <div class="app-list-container">
                @for (reg of myRegistrations(); track reg.id) {
                  <div class="app-list-item">
                    <div class="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div>
                        <h3 class="text-sm font-bold text-gray-900">{{ reg.topicTitle }}</h3>
                        <p class="text-[11px] text-gray-400 mt-0.5">Ngày gửi: {{ reg.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
                        @if (reg.rejectReason) {
                          <div class="mt-2 bg-red-50 text-[11px] text-red-700 px-2 py-1 rounded border border-red-100">
                            <span class="font-bold">Từ chối:</span> {{ reg.rejectReason }}
                          </div>
                        }
                      </div>
                      <span [class]="getRegStatusClass(reg.status)" class="app-badge shrink-0">
                        {{ getRegStatusLabel(reg.status) }}
                      </span>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class TopicsComponent implements OnInit {
  private topicService = inject(TopicService);
  private regService = inject(TopicRegistrationService);
  private batchService = inject(BatchService);
  private snackBar = inject(MatSnackBar);

  activeTab = signal<'available' | 'my'>('available');
  topics = signal<Topic[]>([]);
  myRegistrations = signal<TopicRegistration[]>([]);
  batches = signal<any[]>([]);
  loading = signal(true);
  loadingRegistrations = signal(true);
  registering = signal(false);

  searchText = '';
  selectedBatchId = '';
  private searchTimeout: any;

  ngOnInit(): void {
    this.loadBatches();
    this.loadTopics();
    this.loadMyRegistrations();
  }

  loadBatches(): void {
    this.batchService.listBatches({ status: 'ACTIVE', size: 100 }).subscribe({
      next: (res: any) => {
        const data = res?.content || res || [];
        this.batches.set(Array.isArray(data) ? data : []);
      },
      error: () => { }
    });
  }

  loadTopics(): void {
    this.loading.set(true);
    const params: any = {};
    if (this.selectedBatchId) params.batchId = this.selectedBatchId;
    if (this.searchText) params.search = this.searchText;

    this.topicService.getAvailableTopics(params).subscribe({
      next: (res) => {
        this.topics.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadMyRegistrations(): void {
    this.loadingRegistrations.set(true);
    this.regService.getMyStudentRegistrations().subscribe({
      next: (res: any) => {
        this.myRegistrations.set(res.data || []);
        this.loadingRegistrations.set(false);
      },
      error: () => this.loadingRegistrations.set(false)
    });
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadTopics(), 400);
  }

  registerForTopic(topic: Topic): void {
    if (!confirm(`Bạn muốn đăng ký đề tài "${topic.title}"?`)) return;
    this.registering.set(true);
    this.regService.registerTopic(topic.id).subscribe({
      next: () => {
        this.snackBar.open('Đăng ký thành công! Vui lòng chờ giảng viên duyệt.', 'OK', { duration: 4000 });
        this.registering.set(false);
        this.loadMyRegistrations();
        this.loadTopics();
      },
      error: (err: any) => {
        const msg = err?.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
        this.snackBar.open(msg, 'Đóng', { duration: 5000 });
        this.registering.set(false);
      }
    });
  }

  getSlotsRemaining(topic: Topic): number {
    return topic.maxStudents - topic.currentStudents;
  }

  isAlreadyRegistered(topicId: string): boolean {
    return this.myRegistrations().some(r => r.topicId === topicId && r.status === 'PENDING');
  }

  getRegStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'Chờ duyệt';
      case 'APPROVED': return 'Đã duyệt';
      case 'REJECTED': return 'Từ chối';
      default: return status;
    }
  }

  getRegStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'REJECTED': return 'bg-red-50 text-red-500 border border-red-100';
      default: return 'bg-gray-50 text-gray-500';
    }
  }

  getRegIcon(status: string): string {
    switch (status) {
      case 'PENDING': return 'hourglass_empty';
      case 'APPROVED': return 'check_circle';
      case 'REJECTED': return 'cancel';
      default: return 'help';
    }
  }

  getRegIconBg(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-amber-50';
      case 'APPROVED': return 'bg-emerald-50';
      case 'REJECTED': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  }

  getRegIconColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'text-amber-500';
      case 'APPROVED': return 'text-emerald-500';
      case 'REJECTED': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }
}
