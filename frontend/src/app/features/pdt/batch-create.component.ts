import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BatchService, AcademicYear } from '../../core/batch.service';

@Component({
    selector: 'app-batch-create',
    standalone: true,
    imports: [ReactiveFormsModule, MatIconModule, CommonModule],
    template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-4">
        <button (click)="goBack()"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Tạo đợt đồ án mới</h2>
          <p class="mt-0.5 text-sm text-gray-500">Thiết lập thông tin và các mốc thời gian cho đợt đồ án tốt nghiệp.</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">

        <!-- Card 1: Thông tin chung -->
        <div class="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div class="flex items-center space-x-2">
              <mat-icon class="text-indigo-500 !text-[20px]">info</mat-icon>
              <h3 class="text-base font-semibold text-gray-900">Thông tin chung</h3>
            </div>
          </div>
          <div class="p-6 space-y-5">
            <!-- Tên đợt -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Tên đợt đồ án <span class="text-red-500">*</span>
              </label>
              <input id="name" type="text" formControlName="name"
                placeholder="VD: Đợt Đồ án Tốt nghiệp HK2 2024-2025"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border">
              @if (form.get('name')?.touched && form.get('name')?.hasError('required')) {
                <p class="mt-1 text-xs text-red-600">Vui lòng nhập tên đợt đồ án.</p>
              }
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Năm học -->
              <div>
                <label for="academicYearId" class="block text-sm font-medium text-gray-700 mb-1">
                  Năm học <span class="text-red-500">*</span>
                </label>
                <select id="academicYearId" formControlName="academicYearId"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border">
                  <option value="">-- Chọn năm học --</option>
                  @for (ay of academicYears(); track ay.id) {
                    <option [value]="ay.id">{{ ay.name }}</option>
                  }
                </select>
                @if (form.get('academicYearId')?.touched && form.get('academicYearId')?.hasError('required')) {
                  <p class="mt-1 text-xs text-red-600">Vui lòng chọn năm học.</p>
                }
              </div>

              <!-- Học kỳ -->
              <div>
                <label for="semester" class="block text-sm font-medium text-gray-700 mb-1">
                  Học kỳ <span class="text-red-500">*</span>
                </label>
                <select id="semester" formControlName="semester"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border">
                  <option [ngValue]="null">-- Chọn học kỳ --</option>
                  <option [ngValue]="1">Học kỳ 1</option>
                  <option [ngValue]="2">Học kỳ 2</option>
                  <option [ngValue]="3">Học kỳ hè</option>
                </select>
                @if (form.get('semester')?.touched && form.get('semester')?.hasError('required')) {
                  <p class="mt-1 text-xs text-red-600">Vui lòng chọn học kỳ.</p>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Mốc thời gian -->
        <div class="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div class="flex items-center space-x-2">
              <mat-icon class="text-indigo-500 !text-[20px]">calendar_month</mat-icon>
              <h3 class="text-base font-semibold text-gray-900">Các mốc thời gian</h3>
            </div>
            <p class="mt-1 text-xs text-gray-500">Các giai đoạn phải diễn ra tuần tự: ĐK Đề tài → Đề cương → Thực hiện → ĐK Bảo vệ → Bảo vệ.</p>
          </div>
          <div class="p-6 space-y-6">

            <!-- Giai đoạn 1: ĐK Đề tài -->
            <div class="relative pl-8 pb-6 border-l-2 border-indigo-200">
              <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                <span class="text-white text-[10px] font-bold">1</span>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-800 mb-3">
                  <mat-icon class="!text-[16px] mr-1 align-middle text-indigo-500">edit_note</mat-icon>
                  Đăng ký đề tài
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Ngày bắt đầu <span class="text-red-500">*</span></label>
                    <input type="date" formControlName="topicRegStart"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Ngày kết thúc <span class="text-red-500">*</span></label>
                    <input type="date" formControlName="topicRegEnd"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                  </div>
                </div>
              </div>
            </div>

            <!-- Giai đoạn 2: Đề cương -->
            <div class="relative pl-8 pb-6 border-l-2 border-indigo-200">
              <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                <span class="text-white text-[10px] font-bold">2</span>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-800 mb-3">
                  <mat-icon class="!text-[16px] mr-1 align-middle text-indigo-500">description</mat-icon>
                  Nộp / Duyệt đề cương
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Ngày bắt đầu <span class="text-red-500">*</span></label>
                    <input type="date" formControlName="outlineStart"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Ngày kết thúc <span class="text-red-500">*</span></label>
                    <input type="date" formControlName="outlineEnd"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                  </div>
                </div>
              </div>
            </div>

            <!-- Giai đoạn 3: Thực hiện -->
            <div class="relative pl-8 pb-6 border-l-2 border-indigo-200">
              <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                <span class="text-white text-[10px] font-bold">3</span>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-800 mb-3">
                  <mat-icon class="!text-[16px] mr-1 align-middle text-indigo-500">code</mat-icon>
                  Thực hiện đồ án
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Ngày bắt đầu <span class="text-red-500">*</span></label>
                    <input type="date" formControlName="implementationStart"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Ngày kết thúc <span class="text-red-500">*</span></label>
                    <input type="date" formControlName="implementationEnd"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                  </div>
                </div>
              </div>
            </div>

            <!-- Giai đoạn 4: ĐK Bảo vệ -->
            <div class="relative pl-8 pb-6 border-l-2 border-indigo-200">
              <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                <span class="text-white text-[10px] font-bold">4</span>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-800 mb-3">
                  <mat-icon class="!text-[16px] mr-1 align-middle text-indigo-500">how_to_reg</mat-icon>
                  Đăng ký bảo vệ
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Ngày bắt đầu <span class="text-red-500">*</span></label>
                    <input type="date" formControlName="defenseRegStart"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Ngày kết thúc <span class="text-red-500">*</span></label>
                    <input type="date" formControlName="defenseRegEnd"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                  </div>
                </div>
              </div>
            </div>

            <!-- Giai đoạn 5: Bảo vệ (tùy chọn) -->
            <div class="relative pl-8">
              <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
                <span class="text-white text-[10px] font-bold">5</span>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-800 mb-1">
                  <mat-icon class="!text-[16px] mr-1 align-middle text-gray-400">gavel</mat-icon>
                  Bảo vệ đồ án
                  <span class="text-xs font-normal text-gray-400 ml-1">(Tùy chọn – có thể bổ sung sau)</span>
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Ngày bắt đầu</label>
                    <input type="date" formControlName="defenseStart"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Ngày kết thúc</label>
                    <input type="date" formControlName="defenseEnd"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Server error -->
        @if (serverError()) {
          <div class="rounded-lg bg-red-50 border border-red-200 p-4">
            <div class="flex">
              <mat-icon class="text-red-400 flex-shrink-0">error_outline</mat-icon>
              <p class="ml-3 text-sm text-red-700">{{ serverError() }}</p>
            </div>
          </div>
        }

        <!-- Submit buttons -->
        <div class="flex items-center justify-end space-x-3 pt-2 pb-6">
          <button type="button" (click)="goBack()"
            class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button type="submit" [disabled]="submitting()"
            class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            @if (submitting()) {
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang tạo...
            } @else {
              <mat-icon class="mr-2 !text-[18px]">save</mat-icon>
              Tạo đợt đồ án
            }
          </button>
        </div>
      </form>
    </div>
  `
})
export class BatchCreateComponent implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private batchService = inject(BatchService);

    academicYears = signal<AcademicYear[]>([]);
    submitting = signal(false);
    serverError = signal<string | null>(null);

    form: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(200)]],
        academicYearId: ['', Validators.required],
        semester: [null, Validators.required],
        topicRegStart: ['', Validators.required],
        topicRegEnd: ['', Validators.required],
        outlineStart: ['', Validators.required],
        outlineEnd: ['', Validators.required],
        implementationStart: ['', Validators.required],
        implementationEnd: ['', Validators.required],
        defenseRegStart: ['', Validators.required],
        defenseRegEnd: ['', Validators.required],
        defenseStart: [''],
        defenseEnd: [''],
    });

    ngOnInit(): void {
        this.batchService.getAcademicYears().subscribe({
            next: data => this.academicYears.set(data),
            error: () => this.serverError.set('Không thể tải danh sách năm học.')
        });
    }

    onSubmit(): void {
        // Mark all as touched to show validation errors
        this.form.markAllAsTouched();
        if (this.form.invalid) return;

        // Client-side date validation
        const v = this.form.value;
        const dateError = this.validateDates(v);
        if (dateError) {
            this.serverError.set(dateError);
            return;
        }

        this.submitting.set(true);
        this.serverError.set(null);

        const payload = {
            name: v.name.trim(),
            academicYearId: v.academicYearId,
            semester: v.semester,
            topicRegStart: v.topicRegStart,
            topicRegEnd: v.topicRegEnd,
            outlineStart: v.outlineStart,
            outlineEnd: v.outlineEnd,
            implementationStart: v.implementationStart,
            implementationEnd: v.implementationEnd,
            defenseRegStart: v.defenseRegStart,
            defenseRegEnd: v.defenseRegEnd,
            ...(v.defenseStart ? { defenseStart: v.defenseStart } : {}),
            ...(v.defenseEnd ? { defenseEnd: v.defenseEnd } : {}),
        };

        this.batchService.createBatch(payload).subscribe({
            next: () => {
                this.submitting.set(false);
                this.router.navigate(['/pdt/batches']);
            },
            error: err => {
                this.submitting.set(false);
                this.serverError.set(
                    err?.error?.message || 'Đã xảy ra lỗi khi tạo đợt đồ án. Vui lòng thử lại.'
                );
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/pdt/batches']);
    }

    /** Client-side date sequence validation (mirrors backend logic) */
    private validateDates(v: any): string | null {
        const pairs: [string, string, string][] = [
            [v.topicRegStart, v.topicRegEnd, 'Ngày bắt đầu ĐK đề tài phải trước ngày kết thúc'],
            [v.outlineStart, v.outlineEnd, 'Ngày bắt đầu đề cương phải trước ngày kết thúc'],
            [v.implementationStart, v.implementationEnd, 'Ngày bắt đầu thực hiện phải trước ngày kết thúc'],
            [v.defenseRegStart, v.defenseRegEnd, 'Ngày bắt đầu ĐK bảo vệ phải trước ngày kết thúc'],
        ];
        for (const [from, to, msg] of pairs) {
            if (from && to && from >= to) return msg;
        }

        const sequence: [string, string, string][] = [
            [v.topicRegEnd, v.outlineStart, 'Giai đoạn ĐK đề tài phải kết thúc trước khi bắt đầu đề cương'],
            [v.outlineEnd, v.implementationStart, 'Giai đoạn đề cương phải kết thúc trước khi bắt đầu thực hiện'],
            [v.implementationEnd, v.defenseRegStart, 'Giai đoạn thực hiện phải kết thúc trước khi bắt đầu ĐK bảo vệ'],
        ];
        for (const [from, to, msg] of sequence) {
            if (from && to && from >= to) return msg;
        }

        if (v.defenseStart && v.defenseEnd && v.defenseStart >= v.defenseEnd) {
            return 'Ngày bắt đầu bảo vệ phải trước ngày kết thúc';
        }
        if (v.defenseStart && v.defenseRegEnd && v.defenseRegEnd >= v.defenseStart) {
            return 'Giai đoạn ĐK bảo vệ phải kết thúc trước khi bắt đầu bảo vệ';
        }

        return null;
    }
}
