import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ImportService, ImportResult } from '../../core/import.service';

type ImportType = 'STUDENT' | 'LECTURER';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Import Dữ liệu Hệ thống</h2>
          <p class="mt-1 text-sm text-gray-500">Cấp quyền truy cập cho Sinh viên hoặc Giảng viên bằng cách import từ file.</p>
        </div>
      </div>

      <!-- Type Selection -->
      <div class="flex space-x-4">
        <button (click)="setType('STUDENT')" 
          [class]="importType() === 'STUDENT' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300'"
          class="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all">
          <mat-icon class="mr-2 !text-[20px]">school</mat-icon>
          Sinh viên
        </button>
        <button (click)="setType('LECTURER')" 
          [class]="importType() === 'LECTURER' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300'"
          class="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all">
          <mat-icon class="mr-2 !text-[20px]">person</mat-icon>
          Giảng viên
        </button>
      </div>

      <!-- Upload Card -->
      <div class="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div class="p-8">
          <div class="max-w-xl">
            <h3 class="text-lg font-semibold text-gray-900">
              Tải lên danh sách {{ importType() === 'STUDENT' ? 'Sinh viên' : 'Giảng viên' }}
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              File CSV phải tuân thủ đúng định dạng mẫu. Hệ thống sẽ tự động cập nhật nếu dữ liệu đã tồn tại.
            </p>
          </div>

          <div class="mt-8">
            <div class="max-w-2xl">
              <label 
                (dragover)="$event.preventDefault()" 
                (drop)="onDrop($event)"
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <mat-icon class="!text-[48px] text-gray-400 mb-4 h-auto w-auto">cloud_upload</mat-icon>
                  <p class="mb-2 text-sm text-gray-700">
                    <span class="font-semibold">Bấm để tải file</span> hoặc kéo thả vào đây
                  </p>
                  <p class="text-xs text-gray-500">Chỉ chấp nhận file CSV (Max 10MB)</p>
                  @if (selectedFile()) {
                    <div class="mt-4 px-4 py-2 bg-indigo-50 rounded-lg flex items-center text-indigo-700 text-sm animate-fade-in">
                      <mat-icon class="mr-2 !text-[18px]">insert_drive_file</mat-icon>
                      {{ selectedFile()!.name }}
                      <button (click)="$event.preventDefault(); selectedFile.set(null)" class="ml-2 hover:text-indigo-900">
                        <mat-icon class="!text-[16px]">close</mat-icon>
                      </button>
                    </div>
                  }
                </div>
                <input type="file" class="hidden" (change)="onFileSelected($event)" accept=".csv"/>
              </label>
            </div>
          </div>

          <div class="mt-8 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <a [href]="importType() === 'STUDENT' ? '/assets/samples/pdt_import_students.csv' : '/assets/samples/pdt_import_lecturers.csv'" 
                download class="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                <mat-icon class="mr-1 !text-[18px]">download</mat-icon>
                Tải file mẫu
              </a>
            </div>
            <button 
              (click)="upload()"
              [disabled]="!selectedFile() || uploading()"
              class="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
              @if (uploading()) {
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              } @else {
                Bắt đầu Import
              }
            </button>
          </div>
        </div>
      </div>

      <!-- Results -->
      @if (result(); as res) {
        <div class="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden animate-slide-up">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900">Kết quả xử lý</h3>
            <span class="text-sm text-gray-500">Hoàn thành lúc {{ lastImportAt | date:'HH:mm:ss dd/MM' }}</span>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="p-4 bg-green-50 rounded-xl border border-green-100 flex items-center">
                <div class="bg-green-100 p-2 rounded-lg mr-4">
                  <mat-icon class="text-green-600">check_circle</mat-icon>
                </div>
                <div>
                  <p class="text-sm text-green-700 font-medium">Thành công</p>
                  <p class="text-2xl font-bold text-green-800">{{ res.successCount }}</p>
                </div>
              </div>
              <div class="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center">
                <div class="bg-red-100 p-2 rounded-lg mr-4">
                  <mat-icon class="text-red-600">error</mat-icon>
                </div>
                <div>
                  <p class="text-sm text-red-700 font-medium">Thất bại</p>
                  <p class="text-2xl font-bold text-red-800">{{ res.failureCount }}</p>
                </div>
              </div>
            </div>

            @if (res.errors.length > 0) {
              <div class="space-y-3">
                <h4 class="text-sm font-semibold text-gray-900">Chi tiết lỗi ({{ res.errors.length }} dòng)</h4>
                <div class="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50 sticky top-0">
                      <tr>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-16">Dòng</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-24">Định danh</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-28">Loại lỗi</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nội dung</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      @for (err of res.errors; track err.rowNumber) {
                        <tr class="text-xs hover:bg-gray-50 transition-colors">
                          <td class="px-4 py-2.5 whitespace-nowrap text-gray-500 font-mono">{{ err.rowNumber }}</td>
                          <td class="px-4 py-2.5 whitespace-nowrap font-medium text-gray-900">{{ err.identifier }}</td>
                          <td class="px-4 py-2.5 whitespace-nowrap">
                            <span [class]="getErrorBadgeClass(err.message)" 
                                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                              <mat-icon class="!text-[14px] mr-1">{{ getErrorIcon(err.message) }}</mat-icon>
                              {{ getErrorType(err.message) }}
                            </span>
                          </td>
                          <td class="px-4 py-2.5 text-gray-700">{{ err.message }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class ImportComponent {
  private importService = inject(ImportService);

  importType = signal<ImportType>('STUDENT');
  selectedFile = signal<File | null>(null);
  uploading = signal(false);
  result = signal<ImportResult | null>(null);
  lastImportAt: Date | null = null;

  setType(type: ImportType) {
    this.importType.set(type);
    this.result.set(null);
    this.selectedFile.set(null);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedFile.set(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.name.endsWith('.csv')) {
      this.selectedFile.set(file);
    }
  }

  upload() {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.result.set(null);

    const obs = this.importType() === 'STUDENT'
      ? this.importService.importStudents(file)
      : this.importService.importLecturers(file);

    obs.subscribe({
      next: (res) => {
        this.result.set(res);
        this.uploading.set(false);
        this.selectedFile.set(null);
        this.lastImportAt = new Date();
      },
      error: (err) => {
        alert(err?.error?.message || 'Có lỗi xảy ra khi upload file.');
        this.uploading.set(false);
      }
    });
  }

  getErrorType(message: string): string {
    if (message.includes('Trùng lặp')) return 'Trùng lặp';
    if (message.includes('Thiếu dữ liệu')) return 'Thiếu dữ liệu';
    if (message.includes('tham chiếu') || message.includes('Không tìm thấy')) return 'Không tìm thấy';
    if (message.includes('định dạng')) return 'Sai định dạng';
    if (message.includes('Cột không hợp lệ')) return 'Cột sai';
    return 'Lỗi khác';
  }

  getErrorIcon(message: string): string {
    if (message.includes('Trùng lặp')) return 'content_copy';
    if (message.includes('Thiếu dữ liệu')) return 'warning';
    if (message.includes('tham chiếu') || message.includes('Không tìm thấy')) return 'link_off';
    if (message.includes('định dạng')) return 'data_object';
    if (message.includes('Cột không hợp lệ')) return 'view_column';
    return 'error_outline';
  }

  getErrorBadgeClass(message: string): string {
    if (message.includes('Trùng lặp')) return 'bg-yellow-100 text-yellow-800';
    if (message.includes('Thiếu dữ liệu')) return 'bg-orange-100 text-orange-800';
    if (message.includes('tham chiếu') || message.includes('Không tìm thấy')) return 'bg-purple-100 text-purple-800';
    if (message.includes('định dạng')) return 'bg-blue-100 text-blue-800';
    if (message.includes('Cột không hợp lệ')) return 'bg-pink-100 text-pink-800';
    return 'bg-red-100 text-red-800';
  }
}
