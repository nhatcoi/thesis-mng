import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lecturer-topics',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Quản lý đề tài của tôi</h2>
        <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          <mat-icon class="mr-2 text-sm">add</mat-icon>
          Tạo đề tài
        </button>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li>
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-indigo-600 truncate">Hệ thống gợi ý sản phẩm dựa trên hành vi người dùng</p>
                <div class="ml-2 flex-shrink-0 flex">
                  <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">AVAILABLE</p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="flex items-center text-sm text-gray-500">
                    <mat-icon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400">group</mat-icon>
                    Slot: 1/2
                  </p>
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 space-x-4">
                  <button class="text-indigo-600 hover:text-indigo-900">Sửa</button>
                  <button class="text-red-600 hover:text-red-900">Ẩn</button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class TopicsComponent {}
