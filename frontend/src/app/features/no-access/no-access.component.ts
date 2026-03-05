import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-no-access',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white rounded-xl shadow p-6">
        <h1 class="text-xl font-semibold text-gray-900">Không có quyền truy cập</h1>
        <p class="mt-2 text-sm text-gray-600">
          Tài khoản SSO của bạn đã đăng nhập thành công nhưng không thỏa điều kiện vào hệ thống ĐATN.
        </p>

        @if (reason(); as r) {
          <div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p class="text-sm text-amber-900 font-medium">{{ r.message }}</p>
            <p class="mt-1 text-xs text-amber-700">Mã lỗi: {{ r.reasonCode }}</p>
          </div>
        }

        <div class="mt-6 flex gap-3">
          <button (click)="goHome()"
                  class="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
            Về trang chủ
          </button>
          <button (click)="logout()"
                  class="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  `
})
export class NoAccessComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  reason = this.auth.loginDenied;

  goHome(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.auth.logout();
  }
}

