import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThesisService, ThesisResponse } from '../../core/thesis.service';

@Component({
  selector: 'app-head-thesis-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-300">
      <!-- Header with Back Button -->
      <div class="app-section-header flex justify-between items-center">
        <div class="flex items-center gap-3">
          <button (click)="goBack()" class="app-btn-secondary !p-1.5 !rounded-full">
            <mat-icon class="!text-lg">arrow_back</mat-icon>
          </button>
          <div>
            <h2 class="app-title">Chi tiết Hồ sơ Đồ án</h2>
            <p class="app-subtitle italic">Xem thông tin chi tiết và tiến trình thực hiện.</p>
          </div>
        </div>

        @if (thesis(); as t) {
          <span [class]="getStatusClass(t.status)" class="app-badge font-bold uppercase tracking-wider">
            {{ getStatusLabel(t.status) }}
          </span>
        }
      </div>

      @if (loading()) {
        <div class="app-card p-20 text-center text-xs">
          <div class="flex justify-center mb-2"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
          <p class="text-gray-400 font-medium italic">Đang tải dữ liệu hồ sơ...</p>
        </div>
      } @else if (error()) {
        <div class="app-card p-10 text-center border-red-100 bg-red-50/20">
          <mat-icon class="text-red-400 !text-3xl mb-2">report_problem</mat-icon>
          <h3 class="text-sm font-bold text-gray-900">Lỗi tải dữ liệu</h3>
          <p class="text-xs text-gray-500 mt-1 italic">{{ error() }}</p>
          <button (click)="loadThesis()" class="app-btn-primary mt-4">Thử lại</button>
        </div>
      } @else if (thesis(); as t) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Main Info Column -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Topic Section -->
            <div class="app-card p-5">
              <div class="flex items-start gap-4 mb-4">
                <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                  <mat-icon>description</mat-icon>
                </div>
                <div>
                  <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Tên đề tài đồ án</h3>
                  <h4 class="text-base font-bold text-gray-900 leading-snug">{{ t.topicName }}</h4>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 font-mono italic">
                <div>
                  <p class="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-1">Đợt đồ án</p>
                  <p class="text-xs font-bold text-gray-700">{{ t.batchName }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-1">Mã hồ sơ</p>
                  <p class="text-xs font-bold text-indigo-600">{{ t.id.split('-')[0].toUpperCase() }}</p>
                </div>
              </div>
            </div>

            <!-- Progress List -->
            <div class="app-card p-5">
              <div class="flex items-center gap-2 mb-4 text-gray-900 italic">
                <mat-icon class="text-gray-400 !text-lg">sort</mat-icon>
                <h3 class="text-xs font-bold">Tiến trình hệ thống</h3>
              </div>
              
              <div class="space-y-4 relative ml-2">
                <div class="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                
                <div class="flex gap-4 relative">
                  <div class="w-6 h-6 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center z-10 shadow-sm">
                    <div class="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-900 italic">Hồ sơ đã được khởi tạo</p>
                    <p class="text-[10px] text-gray-500 mt-0.5 italic">Ghi nhận tham gia đồ án chính thức.</p>
                  </div>
                </div>

                <div class="flex gap-4 relative opacity-40">
                  <div class="w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center z-10">
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                  </div>
                  <p class="text-[10px] text-gray-400 font-bold italic pt-1">Giai đoạn báo cáo kết quả và duyệt hoàn thành...</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Column -->
          <div class="space-y-4">
            <!-- Student Card -->
            <div class="app-card p-5">
               <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 italic">Sinh viên thực hiện</p>
               <div class="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
                 <div class="w-10 h-10 bg-gray-900 text-white rounded flex items-center justify-center text-sm font-bold shadow-md">
                   {{ t.studentFirstName.charAt(0) }}
                 </div>
                 <div class="min-w-0">
                   <h4 class="text-xs font-bold text-gray-900 truncate">{{ t.studentLastName }} {{ t.studentFirstName }}</h4>
                   <p class="text-indigo-600 text-[10px] font-mono font-bold">{{ t.studentCode }}</p>
                 </div>
               </div>
               <div class="space-y-2 font-mono italic">
                 <div>
                   <span class="text-[9px] text-gray-400 uppercase font-black tracking-tighter block">Ngành học</span>
                   <span class="text-[11px] font-bold text-gray-700">{{ t.majorName }}</span>
                 </div>
                 <div>
                   <span class="text-[9px] text-gray-400 uppercase font-black tracking-tighter block">Khoa trực thuộc</span>
                   <span class="text-[11px] font-bold text-gray-700">{{ t.facultyName }}</span>
                 </div>
               </div>
            </div>

            <!-- Advisor Card -->
            <div class="app-card p-5 bg-indigo-50/20 border-indigo-50">
               <p class="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3 italic">Cán bộ hướng dẫn</p>
               <div class="flex items-center gap-3 mb-4">
                 <div class="w-10 h-10 rounded-full bg-white border border-indigo-100 text-indigo-400 flex items-center justify-center shadow-sm">
                   <mat-icon class="!text-lg">person</mat-icon>
                 </div>
                 <div>
                   <h4 class="text-xs font-bold text-gray-900">{{ t.advisorName }}</h4>
                   <p class="text-[9px] text-indigo-500 font-black italic uppercase tracking-widest">Giảng viên bộ môn</p>
                 </div>
               </div>
               <button class="app-btn-secondary w-full flex items-center justify-center gap-2 !py-2 !text-[10px] bg-white italic">
                 <mat-icon class="!text-sm">chat_bubble_outline</mat-icon> Gửi lời nhắn
               </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ThesisDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private thesisService = inject(ThesisService);

  thesis = signal<ThesisResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadThesis();
  }

  loadThesis() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Mã hồ sơ không hợp lệ.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.thesisService.getThesisById(id).subscribe({
      next: (data) => {
        this.thesis.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading thesis:', err);
        this.error.set(err?.error?.message || 'Không thể liên kết với máy chủ để lấy dữ liệu.');
        this.loading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/head/students']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ELIGIBLE_FOR_THESIS': return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'COMPLETED': case 'PASSED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'FAILED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'ELIGIBLE_FOR_THESIS': return 'Đủ ĐK làm đồ án';
      case 'IN_PROGRESS': return 'Đang thực hiện';
      case 'COMPLETED': return 'Đã hoàn thành';
      case 'PASSED': return 'Đạt';
      case 'FAILED': return 'Không đạt';
      default: return status;
    }
  }
}
