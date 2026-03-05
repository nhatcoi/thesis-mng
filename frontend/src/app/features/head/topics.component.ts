import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-head-topics',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Đề tài sinh viên đề xuất</h2>
      
      <div class="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Ứng dụng AI trong chẩn đoán y khoa</h3>
              <p class="text-sm text-gray-500 mt-1">Đề xuất bởi: Nguyễn Văn B (20123457)</p>
            </div>
            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">CHỜ PHÂN CÔNG</span>
          </div>
          <p class="mt-4 text-sm text-gray-600">
            Nghiên cứu và ứng dụng các mô hình học sâu để hỗ trợ bác sĩ trong việc chẩn đoán hình ảnh X-quang...
          </p>
          <div class="mt-6">
            <label for="lecturer-select" class="block text-sm font-medium text-gray-700">Phân công giảng viên hướng dẫn</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <select id="lecturer-select" class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300">
                <option>Chọn giảng viên...</option>
                <option>TS. Lê Văn C</option>
                <option>ThS. Trần Thị D</option>
              </select>
              <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700">
                Phân công
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TopicsComponent {}
