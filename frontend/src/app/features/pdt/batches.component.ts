import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BatchService, ThesisBatch, BatchStatus } from '../../core/batch.service';

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Quản lý đợt đồ án</h2>
          <p class="mt-1 text-sm text-gray-500">Thiết lập và quản lý các đợt đồ án tốt nghiệp theo học kỳ.</p>
        </div>
        <button (click)="goToCreate()"
          class="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          <mat-icon class="mr-2 !text-[18px]">add</mat-icon>
          Tạo đợt mới
        </button>
      </div>

      <!-- Filter tabs -->
      <div class="border-b border-gray-200">
        <nav class="flex space-x-6" aria-label="Tabs">
          @for (tab of tabs; track tab.value) {
            <button (click)="filterByStatus(tab.value)"
              [class]="activeTab() === tab.value
                ? 'border-indigo-500 text-indigo-600 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm'">
              {{ tab.label }}
              @if (tab.value === null) {
                <span class="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">{{ batches().length }}</span>
              }
            </button>
          }
        </nav>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }

      <!-- Error -->
      @if (error()) {
        <div class="rounded-lg bg-red-50 p-4">
          <div class="flex">
            <mat-icon class="text-red-400">error</mat-icon>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
              <p class="mt-1 text-sm text-red-700">{{ error() }}</p>
              <button (click)="loadBatches()" class="mt-2 text-sm font-medium text-red-600 hover:text-red-500">Thử lại</button>
            </div>
          </div>
        </div>
      }

      <!-- Empty state -->
      @if (!loading() && !error() && batches().length === 0) {
        <div class="text-center py-12">
          <mat-icon class="!text-[48px] text-gray-300">date_range</mat-icon>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Chưa có đợt đồ án nào</h3>
          <p class="mt-2 text-sm text-gray-500">Bắt đầu bằng cách tạo đợt đồ án mới cho học kỳ.</p>
          <div class="mt-6">
            <button (click)="goToCreate()"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700">
              <mat-icon class="mr-2 !text-[18px]">add</mat-icon>
              Tạo đợt đồ án đầu tiên
            </button>
          </div>
        </div>
      }

      <!-- Batch list -->
      @if (!loading() && batches().length > 0) {
        <div class="bg-white shadow-sm border border-gray-200 overflow-hidden rounded-xl">
          <ul role="list" class="divide-y divide-gray-200">
            @for (batch of batches(); track batch.id) {
              <li class="hover:bg-gray-50 transition-colors">
                <div class="px-6 py-5">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center min-w-0">
                      <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                        [class]="statusBgColor(batch.status)">
                        <mat-icon class="!text-[20px]" [class]="statusIconColor(batch.status)">
                          {{ statusIcon(batch.status) }}
                        </mat-icon>
                      </div>
                      <div class="ml-4 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 truncate">{{ batch.name }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">
                          {{ batch.academicYearName }} · Học kỳ {{ batch.semester }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full"
                        [class]="statusBadgeClass(batch.status)">
                        {{ statusLabel(batch.status) }}
                      </span>

                      <!-- Action buttons -->
                      @if (batch.status === 'DRAFT') {
                        <button (click)="activate(batch)" title="Kích hoạt"
                          class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <mat-icon class="!text-[20px]">play_arrow</mat-icon>
                        </button>
                        <button (click)="remove(batch)" title="Xóa"
                          class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <mat-icon class="!text-[20px]">delete</mat-icon>
                        </button>
                      }
                      @if (batch.status === 'ACTIVE') {
                        <button (click)="close(batch)" title="Đóng đợt"
                          class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                          <mat-icon class="!text-[20px]">lock</mat-icon>
                        </button>
                      }
                    </div>
                  </div>

                  <!-- Timeline row -->
                  <div class="mt-3 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-gray-500">
                    <div class="flex items-center">
                      <mat-icon class="!text-[14px] mr-1 text-gray-400">edit_note</mat-icon>
                      <span>ĐK đề tài: {{ batch.topicRegStart | date:'dd/MM' }} – {{ batch.topicRegEnd | date:'dd/MM' }}</span>
                    </div>
                    <div class="flex items-center">
                      <mat-icon class="!text-[14px] mr-1 text-gray-400">description</mat-icon>
                      <span>Đề cương: {{ batch.outlineStart | date:'dd/MM' }} – {{ batch.outlineEnd | date:'dd/MM' }}</span>
                    </div>
                    <div class="flex items-center">
                      <mat-icon class="!text-[14px] mr-1 text-gray-400">code</mat-icon>
                      <span>Thực hiện: {{ batch.implementationStart | date:'dd/MM' }} – {{ batch.implementationEnd | date:'dd/MM' }}</span>
                    </div>
                    <div class="flex items-center">
                      <mat-icon class="!text-[14px] mr-1 text-gray-400">how_to_reg</mat-icon>
                      <span>ĐK bảo vệ: {{ batch.defenseRegStart | date:'dd/MM' }} – {{ batch.defenseRegEnd | date:'dd/MM' }}</span>
                    </div>
                    @if (batch.defenseStart) {
                      <div class="flex items-center">
                        <mat-icon class="!text-[14px] mr-1 text-gray-400">gavel</mat-icon>
                        <span>Bảo vệ: {{ batch.defenseStart | date:'dd/MM' }} – {{ batch.defenseEnd | date:'dd/MM' }}</span>
                      </div>
                    }
                  </div>

                  <p class="mt-2 text-xs text-gray-400">Tạo bởi {{ batch.createdByName }} · {{ batch.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </li>
            }
          </ul>
        </div>
      }
    </div>

    <!-- Confirm Dialog Overlay -->
    @if (confirmAction()) {
      <div class="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50 transition-opacity">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              [class]="confirmAction()!.type === 'delete' ? 'bg-red-100' : 'bg-amber-100'">
              <mat-icon [class]="confirmAction()!.type === 'delete' ? 'text-red-600' : 'text-amber-600'">
                {{ confirmAction()!.type === 'delete' ? 'delete_forever' : 'warning' }}
              </mat-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ confirmAction()!.title }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ confirmAction()!.message }}</p>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button (click)="cancelConfirm()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Hủy
            </button>
            <button (click)="executeConfirm()"
              [class]="confirmAction()!.type === 'delete'
                ? 'px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700'
                : 'px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700'"
              [disabled]="confirming()">
              {{ confirming() ? 'Đang xử lý...' : confirmAction()!.confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class BatchesComponent implements OnInit {
  private batchService = inject(BatchService);
  private router = inject(Router);

  batches = signal<ThesisBatch[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  activeTab = signal<BatchStatus | null>(null);

  confirmAction = signal<{
    type: 'activate' | 'close' | 'delete';
    batch: ThesisBatch;
    title: string;
    message: string;
    confirmLabel: string;
  } | null>(null);
  confirming = signal(false);

  tabs: { label: string; value: BatchStatus | null }[] = [
    { label: 'Tất cả', value: null },
    { label: 'Bản nháp', value: 'DRAFT' },
    { label: 'Đang hoạt động', value: 'ACTIVE' },
    { label: 'Đã đóng', value: 'CLOSED' },
  ];

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.loading.set(true);
    this.error.set(null);
    const status = this.activeTab() ?? undefined;
    this.batchService.listBatches(status).subscribe({
      next: data => {
        this.batches.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message || 'Không thể kết nối đến máy chủ.');
        this.loading.set(false);
      }
    });
  }

  filterByStatus(status: BatchStatus | null): void {
    this.activeTab.set(status);
    this.loadBatches();
  }

  goToCreate(): void {
    this.router.navigate(['/pdt/batches/create']);
  }

  /* ── Confirm pattern ── */
  activate(batch: ThesisBatch): void {
    this.confirmAction.set({
      type: 'activate',
      batch,
      title: 'Kích hoạt đợt đồ án?',
      message: `Đợt "${batch.name}" sẽ chuyển sang trạng thái ACTIVE. Sinh viên và giảng viên sẽ bắt đầu nhìn thấy đợt này.`,
      confirmLabel: 'Kích hoạt',
    });
  }

  close(batch: ThesisBatch): void {
    this.confirmAction.set({
      type: 'close',
      batch,
      title: 'Đóng đợt đồ án?',
      message: `Đợt "${batch.name}" sẽ chuyển sang trạng thái CLOSED. Không thể mở lại sau khi đóng.`,
      confirmLabel: 'Đóng đợt',
    });
  }

  remove(batch: ThesisBatch): void {
    this.confirmAction.set({
      type: 'delete',
      batch,
      title: 'Xóa đợt đồ án?',
      message: `Đợt "${batch.name}" sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.`,
      confirmLabel: 'Xóa',
    });
  }

  cancelConfirm(): void {
    this.confirmAction.set(null);
  }

  executeConfirm(): void {
    const action = this.confirmAction();
    if (!action) return;
    this.confirming.set(true);

    const obs: any = action.type === 'activate'
      ? this.batchService.activateBatch(action.batch.id)
      : action.type === 'close'
        ? this.batchService.closeBatch(action.batch.id)
        : this.batchService.deleteBatch(action.batch.id);

    obs.subscribe({
      next: () => {
        this.confirming.set(false);
        this.confirmAction.set(null);
        this.loadBatches();
      },
      error: () => {
        this.confirming.set(false);
        this.confirmAction.set(null);
      }
    });
  }

  /* ── Utils ── */
  statusLabel(s: BatchStatus): string {
    return { DRAFT: 'Bản nháp', ACTIVE: 'Đang hoạt động', CLOSED: 'Đã đóng', ARCHIVED: 'Lưu trữ' }[s];
  }
  statusBadgeClass(s: BatchStatus): string {
    return {
      DRAFT: 'bg-yellow-100 text-yellow-800',
      ACTIVE: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800',
      ARCHIVED: 'bg-blue-100 text-blue-800',
    }[s];
  }
  statusIcon(s: BatchStatus): string {
    return { DRAFT: 'edit_note', ACTIVE: 'check_circle', CLOSED: 'lock', ARCHIVED: 'inventory_2' }[s];
  }
  statusBgColor(s: BatchStatus): string {
    return { DRAFT: 'bg-yellow-50', ACTIVE: 'bg-green-50', CLOSED: 'bg-gray-100', ARCHIVED: 'bg-blue-50' }[s];
  }
  statusIconColor(s: BatchStatus): string {
    return { DRAFT: 'text-yellow-600', ACTIVE: 'text-green-600', CLOSED: 'text-gray-500', ARCHIVED: 'text-blue-600' }[s];
  }
}
