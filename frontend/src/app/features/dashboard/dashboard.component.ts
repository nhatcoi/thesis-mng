import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Active Batch Info -->
      <div class="bg-white shadow rounded-lg p-6 border-l-4 border-indigo-500">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-medium text-gray-900">Đợt Đồ án Tốt nghiệp HK2 2023-2024</h2>
            <p class="text-sm text-gray-500 mt-1">Trạng thái: <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">ACTIVE</span></p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">Thời gian: 01/02/2024 - 30/06/2024</p>
            <p class="text-sm text-gray-500 mt-1">Tuần hiện tại: Tuần 5</p>
          </div>
        </div>
      </div>

      @if (auth.currentUser()?.activeRole === 'STUDENT') {
        <!-- Student Status -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Trạng thái của bạn</h3>
          
          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-between">
              <div>
                <span class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center ring-8 ring-white">
                  <mat-icon class="text-white text-sm">check</mat-icon>
                </span>
                <span class="absolute -bottom-6 -ml-4 text-xs font-medium text-indigo-600">Đủ ĐK</span>
              </div>
              <div>
                <span class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center ring-8 ring-white">
                  <mat-icon class="text-white text-sm">check</mat-icon>
                </span>
                <span class="absolute -bottom-6 -ml-4 text-xs font-medium text-indigo-600">Đề tài</span>
              </div>
              <div>
                <span class="h-8 w-8 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center ring-8 ring-white">
                  <span class="h-2.5 w-2.5 bg-indigo-600 rounded-full"></span>
                </span>
                <span class="absolute -bottom-6 -ml-6 text-xs font-medium text-indigo-600">Đề cương</span>
              </div>
              <div>
                <span class="h-8 w-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center ring-8 ring-white">
                </span>
                <span class="absolute -bottom-6 -ml-4 text-xs font-medium text-gray-500">Tiến độ</span>
              </div>
              <div>
                <span class="h-8 w-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center ring-8 ring-white">
                </span>
                <span class="absolute -bottom-6 -ml-4 text-xs font-medium text-gray-500">Bảo vệ</span>
              </div>
            </div>
          </div>
          
          <div class="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <mat-icon class="text-yellow-400">warning</mat-icon>
              </div>
              <div class="ml-3">
                <p class="text-sm text-yellow-700">
                  Bạn cần nộp đề cương trước ngày 15/03/2024. <a href="#" class="font-medium underline text-yellow-700 hover:text-yellow-600">Nộp ngay</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      }

      @if (auth.currentUser()?.activeRole === 'LECTURER') {
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0"><mat-icon class="text-gray-400 text-3xl">library_books</mat-icon></div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Đề tài của tôi</dt>
                    <dd class="text-lg font-medium text-gray-900">12</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0"><mat-icon class="text-indigo-600 text-3xl">how_to_reg</mat-icon></div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Yêu cầu đăng ký</dt>
                    <dd class="text-lg font-medium text-gray-900">5 <span class="text-sm text-red-500">(Mới)</span></dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0"><mat-icon class="text-yellow-500 text-3xl">description</mat-icon></div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Đề cương chờ duyệt</dt>
                    <dd class="text-lg font-medium text-gray-900">3</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0"><mat-icon class="text-green-500 text-3xl">group</mat-icon></div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">SV đang hướng dẫn</dt>
                    <dd class="text-lg font-medium text-gray-900">8/15</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      @if (auth.currentUser()?.activeRole === 'TRAINING_DEPT') {
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div class="bg-indigo-600 shadow rounded-lg p-5 text-white">
            <div class="flex items-center">
              <mat-icon class="text-3xl mr-4">calendar_today</mat-icon>
              <div>
                <p class="text-sm opacity-80 uppercase">Đợt đang chạy</p>
                <p class="text-2xl font-bold">2</p>
              </div>
            </div>
          </div>
          <div class="bg-white shadow rounded-lg p-5">
            <div class="flex items-center">
              <mat-icon class="text-blue-500 text-3xl mr-4">school</mat-icon>
              <div>
                <p class="text-sm text-gray-500 uppercase">Tổng sinh viên</p>
                <p class="text-2xl font-bold text-gray-900">450</p>
              </div>
            </div>
          </div>
          <div class="bg-white shadow rounded-lg p-5">
            <div class="flex items-center">
              <mat-icon class="text-green-500 text-3xl mr-4">assignment_ind</mat-icon>
              <div>
                <p class="text-sm text-gray-500 uppercase">Giảng viên tham gia</p>
                <p class="text-2xl font-bold text-gray-900">85</p>
              </div>
            </div>
          </div>
        </div>
      }

      @if (auth.currentUser()?.activeRole === 'DEPT_HEAD') {
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div class="bg-white shadow rounded-lg p-5">
            <div class="flex items-center">
              <mat-icon class="text-orange-500 mr-4">pending_actions</mat-icon>
              <div>
                <p class="text-sm text-gray-500">Đề tài chờ duyệt ngành</p>
                <p class="text-2xl font-bold text-gray-900">18</p>
              </div>
            </div>
          </div>
          <div class="bg-white shadow rounded-lg p-5">
            <div class="flex items-center">
              <mat-icon class="text-indigo-500 mr-4">assignment_turned_in</mat-icon>
              <div>
                <p class="text-sm text-gray-500">Hội đồng đã lập</p>
                <p class="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
        </div>
      }

      @if (auth.currentUser()?.activeRole === 'ADMIN') {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 class="text-red-800 font-bold mb-2 font-medium">Quản trị hệ thống</h3>
          <p class="text-red-600">Bạn đang truy cập với quyền cao nhất. Hãy cẩn trọng khi thay đổi cấu hình hệ thống.</p>
        </div>
      }
    </div>
  `
})
export class DashboardComponent {
  auth = inject(AuthService);
}
