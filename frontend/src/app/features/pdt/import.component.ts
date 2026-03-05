import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Import Sinh viên</h2>
      
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Tải lên danh sách sinh viên</h3>
          <div class="mt-2 max-w-xl text-sm text-gray-500">
            <p>Tải lên file Excel (.xlsx) chứa danh sách sinh viên để kiểm tra điều kiện làm đồ án.</p>
          </div>
          <div class="mt-5">
            <div class="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div class="space-y-1 text-center">
                <mat-icon class="mx-auto h-12 w-12 text-gray-400 text-4xl">upload_file</mat-icon>
                <div class="flex text-sm text-gray-600 justify-center">
                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Tải file lên</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only">
                  </label>
                  <p class="pl-1">hoặc kéo thả vào đây</p>
                </div>
                <p class="text-xs text-gray-500">
                  XLSX, XLS lên đến 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ImportComponent {}
