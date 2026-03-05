import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, Role } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-white text-3xl font-bold">T</span>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Thesis Management System
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hệ thống Quản lý Đồ án Tốt nghiệp - Đại học Phenikaa
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">

          @if (showRoleSelector) {
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 text-center">Chọn vai trò</h3>
              <p class="text-sm text-gray-500 text-center">
                Tài khoản của bạn có nhiều vai trò. Vui lòng chọn vai trò để tiếp tục.
              </p>
              @for (role of availableRoles; track role) {
                <button (click)="selectRole(role)"
                  class="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                  <div class="flex items-center">
                    <span class="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      [class]="getRoleBadgeClass(role)">
                      {{ getRoleIcon(role) }}
                    </span>
                    <span class="ml-3 text-sm font-medium text-gray-900">{{ getRoleLabel(role) }}</span>
                  </div>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              }
            </div>
          } @else {
            <div class="space-y-6">
              <button (click)="loginSSO()"
                class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
                Đăng nhập bằng SSO
              </button>
              <p class="text-xs text-center text-gray-400">
                Sử dụng tài khoản SSO của trường (Zitadel)
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  showRoleSelector = false;
  availableRoles: Role[] = [];

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      if (user.roles.length > 1) {
        this.showRoleSelector = true;
        this.availableRoles = user.roles;
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  loginSSO(): void {
    this.auth.login();
  }

  selectRole(role: Role): void {
    this.auth.setActiveRole(role);
    this.router.navigate(['/dashboard']);
  }

  getRoleLabel(role: Role): string {
    return AuthService.roleLabel(role);
  }

  getRoleIcon(role: Role): string {
    const icons: Record<Role, string> = {
      ADMIN: '🛡',
      TRAINING_DEPT: '🏛',
      DEPT_HEAD: '👨‍💼',
      LECTURER: '👨‍🏫',
      STUDENT: '🎓',
    };
    return icons[role] ?? '👤';
  }

  getRoleBadgeClass(role: Role): string {
    const classes: Record<Role, string> = {
      ADMIN: 'bg-red-100 text-red-600',
      TRAINING_DEPT: 'bg-purple-100 text-purple-600',
      DEPT_HEAD: 'bg-blue-100 text-blue-600',
      LECTURER: 'bg-green-100 text-green-600',
      STUDENT: 'bg-amber-100 text-amber-600',
    };
    return classes[role] ?? 'bg-gray-100 text-gray-600';
  }
}
