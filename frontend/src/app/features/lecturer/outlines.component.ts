import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lecturer-outlines',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Duyệt đề cương</h2>

      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li>
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-indigo-600">Hệ thống quản lý thư viện thông minh</p>
                  <p class="text-sm text-gray-500 mt-1">Sinh viên: Nguyễn Văn A</p>
                </div>
                <div class="flex space-x-2">
                  <button class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700">
                    Duyệt
                  </button>
                  <button class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                    Từ chối
                  </button>
                </div>
              </div>
              <div class="mt-4 flex items-center">
                <mat-icon class="text-gray-400 mr-2">picture_as_pdf</mat-icon>
                <a href="#" class="text-sm text-indigo-600 hover:underline">de_cuong_nguyen_van_a_v1.pdf</a>
                <span class="ml-4 text-xs text-gray-500">Nộp lúc: 10:00 15/03/2024</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class OutlinesComponent {}
