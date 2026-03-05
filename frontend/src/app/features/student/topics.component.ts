import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-topics',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Đăng ký / Đề xuất đề tài</h2>

      <div class="bg-white shadow rounded-lg">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex" aria-label="Tabs">
            <button (click)="activeTab.set('available')" [class.border-indigo-500]="activeTab() === 'available'" [class.text-indigo-600]="activeTab() === 'available'" [class.border-transparent]="activeTab() !== 'available'" [class.text-gray-500]="activeTab() !== 'available'" class="w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300">
              Chọn đề tài có sẵn
            </button>
            <button (click)="activeTab.set('propose')" [class.border-indigo-500]="activeTab() === 'propose'" [class.text-indigo-600]="activeTab() === 'propose'" [class.border-transparent]="activeTab() !== 'propose'" [class.text-gray-500]="activeTab() !== 'propose'" class="w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300">
              Đề xuất đề tài mới
            </button>
          </nav>
        </div>

        <div class="p-6">
          @if (activeTab() === 'available') {
            <div class="space-y-4">
              <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">Hệ thống gợi ý sản phẩm dựa trên hành vi người dùng</h3>
                    <p class="text-sm text-gray-500 mt-1">Giảng viên: TS. Lê Văn C</p>
                  </div>
                  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Còn 1 slot</span>
                </div>
                <p class="mt-2 text-sm text-gray-600">Yêu cầu: Có kiến thức về Machine Learning, Python.</p>
                <div class="mt-4">
                  <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>
          } @else {
            <form class="space-y-6">
              <div>
                <label for="topic-name" class="block text-sm font-medium text-gray-700">Tên đề tài đề xuất</label>
                <div class="mt-1">
                  <input id="topic-name" type="text" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                </div>
              </div>
              <div>
                <label for="topic-desc" class="block text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                <div class="mt-1">
                  <textarea id="topic-desc" rows="4" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
                </div>
              </div>
              <div>
                <label for="lecturer-select" class="block text-sm font-medium text-gray-700">Đề xuất giảng viên hướng dẫn (Tùy chọn)</label>
                <div class="mt-1">
                  <select id="lecturer-select" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                    <option>Không đề xuất (Gửi Trưởng ngành phân công)</option>
                    <option>TS. Lê Văn C</option>
                  </select>
                </div>
              </div>
              <div>
                <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  Gửi đề xuất
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  `
})
export class TopicsComponent {
  activeTab = signal<'available' | 'propose'>('available');
}
