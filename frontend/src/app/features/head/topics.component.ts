import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-head-topics',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-4">
      <div class="app-section-header">
        <h2 class="app-title">Đề tài sinh viên đề xuất</h2>
        <p class="app-subtitle">Xem xét và phân công giảng viên hướng dẫn cho các đề tài do sinh viên tự đề xuất.</p>
      </div>
      
      <div class="app-list-container">
        <!-- Mock Topic 1 -->
        <div class="app-list-item">
          <div class="flex flex-col md:flex-row justify-between gap-4">
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-1">
                <span class="app-badge border-amber-100 bg-amber-50 text-amber-600">CHỜ PHÂN CÔNG</span>
              </div>
              <h3 class="text-sm font-bold text-gray-900">Ứng dụng AI trong chẩn đoán y khoa</h3>
              <p class="text-[11px] text-gray-500 mt-0.5">Đề xuất bởi: <span class="font-bold">Nguyễn Văn B (20123457)</span></p>
              <p class="text-xs text-gray-600 mt-2 line-clamp-2">
                Nghiên cứu và ứng dụng các mô hình học sâu để hỗ trợ bác sĩ trong việc chẩn đoán hình ảnh X-quang...
              </p>
            </div>
            
            <div class="shrink-0 flex flex-col gap-2 min-w-[200px]">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phân công giảng viên</label>
              <div class="flex gap-1">
                <select class="app-select flex-grow !py-1 text-xs">
                  <option>Chọn giảng viên...</option>
                  <option>TS. Lê Văn C</option>
                  <option>ThS. Trần Thị D</option>
                </select>
                <button class="app-btn-primary !px-3 !py-1">Lưu</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TopicsComponent { }
