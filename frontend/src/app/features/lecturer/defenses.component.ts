import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lecturer-defenses',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Duyệt đăng ký bảo vệ</h2>

      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li>
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-indigo-600">Hệ thống quản lý thư viện thông minh</p>
                  <p class="text-sm text-gray-500 mt-1">Sinh viên: Nguyễn Văn A</p>
                </div>
                <div class="flex space-x-2">
                  <button class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700">
                    Duyệt bảo vệ
                  </button>
                  <button class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                    Từ chối
                  </button>
                </div>
              </div>
              <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="flex items-center">
                  <mat-icon class="text-red-400 mr-2">picture_as_pdf</mat-icon>
                  <a href="#" class="text-sm text-indigo-600 hover:underline">Bao_cao_cuoi_cung.pdf</a>
                </div>
                <div class="flex items-center">
                  <mat-icon class="text-yellow-400 mr-2">slideshow</mat-icon>
                  <a href="#" class="text-sm text-indigo-600 hover:underline">Slide_bao_ve.pptx</a>
                </div>
                <div class="flex items-center">
                  <mat-icon class="text-gray-400 mr-2">code</mat-icon>
                  <a href="#" class="text-sm text-indigo-600 hover:underline">Source_code.zip</a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class DefensesComponent {}
