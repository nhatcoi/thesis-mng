import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Quản lý đợt đồ án</h2>
        <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          <mat-icon class="mr-2 text-sm">add</mat-icon>
          Tạo đợt mới
        </button>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li>
            <a href="#" class="block hover:bg-gray-50">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-indigo-600 truncate">Đợt Đồ án Tốt nghiệp HK2 2023-2024</p>
                  <div class="ml-2 flex-shrink-0 flex">
                    <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      ACTIVE
                    </p>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      <mat-icon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400">people</mat-icon>
                      150 SV đủ điều kiện
                    </p>
                    <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <mat-icon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400">assignment</mat-icon>
                      45 Đề tài
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <mat-icon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400">calendar_today</mat-icon>
                    <p>
                      01/02/2024 - 30/06/2024
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </li>
          <li>
            <a href="#" class="block hover:bg-gray-50">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-indigo-600 truncate">Đợt Đồ án Tốt nghiệp HK1 2023-2024</p>
                  <div class="ml-2 flex-shrink-0 flex">
                    <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      CLOSED
                    </p>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      <mat-icon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400">people</mat-icon>
                      120 SV hoàn thành
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <mat-icon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400">calendar_today</mat-icon>
                    <p>
                      01/09/2023 - 15/01/2024
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class BatchesComponent {}
