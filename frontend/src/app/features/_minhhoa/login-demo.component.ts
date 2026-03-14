import { Component } from '@angular/core';

/**
 * Giao diện minh họa chức năng đăng nhập (HTML thuần).
 * Giống ảnh: nền trắng, nút "Đăng nhập" màu xám nhạt, bo góc, căn giữa.
 */
@Component({
  selector: 'app-login-demo',
  standalone: true,
  template: `
    <div style="
      min-height: 100vh;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <button
        type="button"
        style="
          padding: 12px 32px;
          border-radius: 8px;
          background: #e5e7eb;
          color: #4b5563;
          border: 1px solid #d1d5db;
          font-size: 16px;
          font-family: sans-serif;
          cursor: pointer;
        ">
        Đăng nhập
      </button>
    </div>
  `
})
export class LoginDemoComponent {}
