import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-outline',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Nộp đề cương</h2>

      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900">Trạng thái: <span class="text-yellow-600">Chờ duyệt</span></h3>
            <p class="text-sm text-gray-500 mt-1">Đã nộp lúc 10:00 15/03/2024</p>
          </div>

          <div class="border-2 border-gray-300 border-dashed rounded-md p-6 text-center">
            <mat-icon class="mx-auto h-12 w-12 text-gray-400 text-4xl">upload_file</mat-icon>
            <div class="mt-4 flex text-sm text-gray-600 justify-center">
              <label class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                <span>Chọn file mới</span>
                <input type="file" class="sr-only">
              </label>
              <p class="pl-1">để nộp lại</p>
            </div>
            <p class="text-xs text-gray-500 mt-2">PDF lên đến 10MB</p>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Nộp đề cương
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OutlineComponent {}
