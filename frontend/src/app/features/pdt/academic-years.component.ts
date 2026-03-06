import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AcademicYearService, AcademicYear } from '../../core/academic-year.service';

@Component({
  selector: 'app-academic-years',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, FormsModule],
  template: `
    <div class="space-y-4">
      <!-- Header -->
      <div class="app-section-header flex justify-between items-center">
        <div>
          <h2 class="app-title">Quản lý Niên khóa</h2>
          <p class="app-subtitle italic">Danh mục niên khóa chính thức sử dụng trong hệ thống.</p>
        </div>
        <button (click)="openModal()" class="app-btn-primary">
          <mat-icon class="mr-1.5 !text-base">add</mat-icon> Thêm niên khóa
        </button>
      </div>

      <!-- Search Field -->
      <div class="app-card p-4">
        <div class="relative max-w-sm">
          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 !text-base text-gray-400">search</mat-icon>
          <input type="text" [(ngModel)]="searchQuery"
            placeholder="Tìm theo tên niên khóa..." class="app-input pl-9" />
        </div>
      </div>

      <!-- List Table -->
      <div class="app-card">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-50/50 border-b border-gray-100 italic">
            <tr>
              <th class="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tên niên khóa</th>
              <th class="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Bắt đầu</th>
              <th class="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Kết thúc</th>
              <th class="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-xs">
            @for (year of filteredYears(); track year.id) {
              <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="p-3 font-bold text-indigo-700 italic underline decoration-indigo-100 underline-offset-4">{{ year.name }}</td>
                <td class="p-3 text-gray-600 font-mono">{{ year.startDate | date:'dd/MM/yyyy' }}</td>
                <td class="p-3 text-gray-600 font-mono">{{ year.endDate | date:'dd/MM/yyyy' }}</td>
                <td class="p-3 text-right">
                  <div class="flex justify-end gap-1">
                    <button (click)="openModal(year)" class="app-btn-secondary !p-1.5 shadow-none border-transparent hover:text-indigo-600">
                      <mat-icon class="!text-lg">edit</mat-icon>
                    </button>
                    <button (click)="confirmDelete(year)" class="app-btn-secondary !p-1.5 shadow-none border-transparent hover:text-red-500">
                      <mat-icon class="!text-lg">delete_outline</mat-icon>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="p-10 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                  Không tìm thấy dữ liệu niên khóa
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-2xl max-w-sm w-full border border-gray-100 animate-in zoom-in-95 duration-200">
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 italic">
            <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <mat-icon class="text-indigo-600">{{ editingYear() ? 'edit' : 'add_circle' }}</mat-icon>
              {{ editingYear() ? 'Cập nhật Niên khóa' : 'Khai báo Niên khóa' }}
            </h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600"><mat-icon>close</mat-icon></button>
          </div>
          
          <form [formGroup]="form" (ngSubmit)="save()" class="p-6 space-y-4 italic">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5">Tên niên khóa *</label>
              <input type="text" formControlName="name" placeholder="VD: 2024-2025" class="app-input" />
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5">Ngày bắt đầu</label>
                <input type="date" formControlName="startDate" class="app-input" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1.5">Ngày kết thúc</label>
                <input type="date" formControlName="endDate" class="app-input" />
              </div>
            </div>

            @if (errorMessage()) {
              <div class="p-3 bg-red-50 text-red-600 rounded text-[11px] font-bold italic border border-red-100">
                {{ errorMessage() }}
              </div>
            }

            <div class="flex justify-end gap-2 pt-4 border-t border-gray-50">
              <button type="button" (click)="closeModal()" class="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded">Hủy</button>
              <button type="submit" [disabled]="submitting()" class="app-btn-primary !px-6">
                {{ submitting() ? 'Đang lưu...' : 'Lưu dữ liệu' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Delete Confirmation Modal -->
    @if (deleteTarget()) {
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-2xl max-w-sm w-full p-8 text-center border border-gray-100 animate-in fade-in duration-200">
          <div class="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <mat-icon class="!text-2xl">delete_sweep</mat-icon>
          </div>
          <h3 class="text-sm font-bold text-gray-900 mb-1 italic">Xác nhận xóa Niên khóa?</h3>
          <p class="text-[11px] text-gray-500 mb-8 italic">
            Dữ liệu <span class="text-gray-900 font-bold">"{{ deleteTarget()?.name }}"</span> sẽ bị loại bỏ khỏi hệ thống.
          </p>
          <div class="flex gap-2">
            <button (click)="deleteTarget.set(null)" class="flex-1 px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded italic transition-all">Hủy</button>
            <button (click)="onDelete()" [disabled]="submitting()"
              class="flex-1 px-4 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded shadow-sm italic transition-all">
              {{ submitting() ? 'Đang xóa...' : 'Xác nhận xóa' }}
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
  searchQuery = '';

  filteredYears = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    return this.years().filter(y => y.name.toLowerCase().includes(query));
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
        this.errorMessage.set(err?.error?.message || 'Lỗi lưu dữ liệu.');
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
        alert(err?.error?.message || 'Lỗi xóa niên khóa.');
        this.deleteTarget.set(null);
      }
    });
  }

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });
}
