import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AcademicYearService, AcademicYear } from '../../core/academic-year.service';

@Component({
    selector: 'app-academic-years',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatIconModule],
    template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Quản lý Niên khóa</h2>
          <p class="mt-1 text-sm text-gray-500">Danh mục các năm học để thiết lập đợt đồ án.</p>
        </div>
        <button (click)="openModal()"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          <mat-icon class="mr-2 !text-[20px]">add</mat-icon>
          Thêm niên khóa
        </button>
      </div>

      <!-- List -->
      <div class="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên niên khóa</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày bắt đầu</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày kết thúc</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (year of years(); track year.id) {
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ year.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ year.startDate | date:'dd/MM/yyyy' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ year.endDate | date:'dd/MM/yyyy' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button (click)="openModal(year)" class="text-indigo-600 hover:text-indigo-900">
                    <mat-icon class="!text-[20px]">edit</mat-icon>
                  </button>
                  <button (click)="confirmDelete(year)" class="text-red-600 hover:text-red-900">
                    <mat-icon class="!text-[20px]">delete</mat-icon>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-6 py-10 text-center text-sm text-gray-500">
                  Chưa có dữ liệu nào được tạo.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Add/Edit -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ editingYear() ? 'Sửa niên khóa' : 'Thêm niên khóa mới' }}
            </h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-500">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <form [formGroup]="form" (ngSubmit)="save()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên niên khóa</label>
              <input type="text" formControlName="name" placeholder="VD: 2024-2025"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                <input type="date" formControlName="startDate"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                <input type="date" formControlName="endDate"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
              </div>
            </div>

            @if (errorMessage()) {
              <p class="text-xs text-red-600 bg-red-50 p-2 rounded">{{ errorMessage() }}</p>
            }

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" (click)="closeModal()"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Hủy
              </button>
              <button type="submit" [disabled]="submitting()"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                {{ submitting() ? 'Đang lưu...' : 'Lưu lại' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Delete Confirm -->
    @if (deleteTarget()) {
      <div class="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 text-center">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <mat-icon class="text-red-600">delete_forever</mat-icon>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Xóa niên khóa?</h3>
          <p class="text-sm text-gray-500 mb-6">Bạn có chắc muốn xóa niên khóa "{{ deleteTarget()?.name }}"? Hành động này không thể hoàn tác.</p>
          <div class="flex justify-center space-x-3">
            <button (click)="deleteTarget.set(null)"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Hủy
            </button>
            <button (click)="onDelete()" [disabled]="submitting()"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
              Xác nhận xóa
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class AcademicYearsComponent implements OnInit {
    private service = inject(AcademicYearService);
    private fb = inject(FormBuilder);

    years = signal<AcademicYear[]>([]);
    showModal = signal(false);
    submitting = signal(false);
    editingYear = signal<AcademicYear | null>(null);
    deleteTarget = signal<AcademicYear | null>(null);
    errorMessage = signal<string | null>(null);

    form: FormGroup = this.fb.group({
        name: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
    });

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.service.getAll().subscribe(data => this.years.set(data));
    }

    openModal(year?: AcademicYear): void {
        this.errorMessage.set(null);
        if (year) {
            this.editingYear.set(year);
            this.form.patchValue(year);
        } else {
            this.editingYear.set(null);
            this.form.reset();
        }
        this.showModal.set(true);
    }

    closeModal(): void {
        this.showModal.set(false);
        this.editingYear.set(null);
    }

    save(): void {
        if (this.form.invalid) return;
        this.submitting.set(true);
        this.errorMessage.set(null);

        const val = this.form.value;
        const obs$ = this.editingYear()
            ? this.service.update(this.editingYear()!.id, val)
            : this.service.create(val);

        obs$.subscribe({
            next: () => {
                this.submitting.set(false);
                this.closeModal();
                this.refresh();
            },
            error: err => {
                this.submitting.set(false);
                this.errorMessage.set(err?.error?.message || 'Có lỗi xảy ra.');
            }
        });
    }

    confirmDelete(year: AcademicYear): void {
        this.deleteTarget.set(year);
    }

    onDelete(): void {
        const target = this.deleteTarget();
        if (!target) return;

        this.submitting.set(true);
        this.service.delete(target.id).subscribe({
            next: () => {
                this.submitting.set(false);
                this.deleteTarget.set(null);
                this.refresh();
            },
            error: err => {
                this.submitting.set(false);
                alert(err?.error?.message || 'Không thể xóa niên khóa này.');
                this.deleteTarget.set(null);
            }
        });
    }
}
