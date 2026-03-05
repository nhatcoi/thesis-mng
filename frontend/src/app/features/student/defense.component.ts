import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-defense',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Đăng ký bảo vệ</h2>

      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900">Trạng thái: <span class="text-gray-500">Chưa nộp</span></h3>
          </div>

          <div class="space-y-6">
            <div>
              <label for="report-upload" class="block text-sm font-medium text-gray-700">Báo cáo cuối cùng (PDF)</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <mat-icon class="mx-auto h-12 w-12 text-gray-400 text-4xl">picture_as_pdf</mat-icon>
                  <div class="flex text-sm text-gray-600 justify-center">
                    <label class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Tải file lên</span>
                      <input id="report-upload" type="file" class="sr-only">
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label for="code-upload" class="block text-sm font-medium text-gray-700">Source code (ZIP)</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <mat-icon class="mx-auto h-12 w-12 text-gray-400 text-4xl">folder_zip</mat-icon>
                  <div class="flex text-sm text-gray-600 justify-center">
                    <label class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Tải file lên</span>
                      <input id="code-upload" type="file" class="sr-only">
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label for="slide-upload" class="block text-sm font-medium text-gray-700">Slide bảo vệ (PPTX)</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <mat-icon class="mx-auto h-12 w-12 text-gray-400 text-4xl">slideshow</mat-icon>
                  <div class="flex text-sm text-gray-600 justify-center">
                    <label class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Tải file lên</span>
                      <input id="slide-upload" type="file" class="sr-only">
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Gửi đăng ký bảo vệ
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DefenseComponent {}
