import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
            <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900">Truy cập bị từ chối</h2>
          <p class="mt-4 text-lg text-gray-600">
            Tài khoản của bạn đã được xác thực thành công qua SSO, nhưng <strong>không tìm thấy</strong> trong hệ thống quản lý đồ án.
          </p>
          <p class="mt-2 text-sm text-gray-500">
            Vui lòng liên hệ với Phòng Đào tạo hoặc Quản trị viên để được cấp quyền truy cập.
          </p>
          <div class="mt-8">
            <a routerLink="/login" 
               class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              Quay về trang đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent { }
