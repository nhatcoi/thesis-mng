import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lecturer-progress',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Theo dõi tiến độ</h2>

      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Nguyễn Văn A - Hệ thống quản lý thư viện thông minh</h3>
        
        <div class="flow-root">
          <ul role="list" class="-mb-8">
            <li>
              <div class="relative pb-8">
                <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div class="relative flex space-x-3">
                  <div>
                    <span class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                      <mat-icon class="text-white text-sm">check</mat-icon>
                    </span>
                  </div>
                  <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p class="text-sm text-gray-500">Báo cáo tiến độ tuần 5 <a href="#" class="font-medium text-gray-900">Hoàn thành module đăng nhập</a></p>
                      <div class="mt-2 text-sm text-gray-700">
                        <p>Em đã làm xong phần đăng nhập và phân quyền cơ bản. Link github: ...</p>
                      </div>
                      <div class="mt-2 text-sm text-indigo-600 bg-indigo-50 p-2 rounded">
                        <span class="font-medium">Nhận xét của GV:</span> Tốt, tiếp tục làm phần quản lý sách nhé.
                      </div>
                    </div>
                    <div class="text-right text-sm whitespace-nowrap text-gray-500">
                      <time datetime="2020-09-20">20/03/2024</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="relative pb-8">
                <div class="relative flex space-x-3">
                  <div>
                    <span class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                      <mat-icon class="text-white text-sm">edit</mat-icon>
                    </span>
                  </div>
                  <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p class="text-sm text-gray-500">Báo cáo tiến độ tuần 6 <a href="#" class="font-medium text-gray-900">Quản lý sách</a></p>
                      <div class="mt-2 text-sm text-gray-700">
                        <p>Đang gặp lỗi phần upload hình ảnh sách.</p>
                      </div>
                      <div class="mt-2">
                        <button class="text-sm text-indigo-600 hover:text-indigo-900 font-medium">Thêm nhận xét</button>
                      </div>
                    </div>
                    <div class="text-right text-sm whitespace-nowrap text-gray-500">
                      <time datetime="2020-09-22">27/03/2024</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class ProgressComponent {}
