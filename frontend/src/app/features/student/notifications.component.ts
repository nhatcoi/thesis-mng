import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-notifications',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Thông báo & Lịch sử</h2>

      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li>
            <div class="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <mat-icon class="text-green-500 mr-3">check_circle</mat-icon>
                  <p class="text-sm font-medium text-gray-900">Đề tài của bạn đã được duyệt</p>
                </div>
                <div class="ml-2 flex-shrink-0 flex">
                  <p class="text-sm text-gray-500">10:30 10/03/2024</p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="text-sm text-gray-500">
                    Giảng viên TS. Lê Văn C đã chấp nhận yêu cầu đăng ký đề tài "Hệ thống gợi ý sản phẩm".
                  </p>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <mat-icon class="text-yellow-500 mr-3">warning</mat-icon>
                  <p class="text-sm font-medium text-gray-900">Nhắc nhở nộp đề cương</p>
                </div>
                <div class="ml-2 flex-shrink-0 flex">
                  <p class="text-sm text-gray-500">08:00 14/03/2024</p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="text-sm text-gray-500">
                    Hạn chót nộp đề cương là 23:59 ngày 15/03/2024. Vui lòng nộp đúng hạn.
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class NotificationsComponent {}
