import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lecturer-requests',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Yêu cầu đăng ký đề tài</h2>

      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li>
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span class="text-gray-500 font-medium">TV</span>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900">Trần Văn C <span class="text-gray-500 font-normal">(20123458)</span></p>
                    <p class="text-sm text-gray-500">GPA: 3.5 | Tín chỉ: 120</p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700">
                    Chấp nhận
                  </button>
                  <button class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                    Từ chối
                  </button>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-sm text-gray-600"><span class="font-medium">Đề tài đăng ký:</span> Hệ thống gợi ý sản phẩm dựa trên hành vi người dùng</p>
                <p class="text-sm text-gray-600 mt-1"><span class="font-medium">Ghi chú của SV:</span> Em rất thích lĩnh vực AI và đã học các môn liên quan.</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class RequestsComponent {}
