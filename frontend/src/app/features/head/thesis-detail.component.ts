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
    <div class="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <!-- Header with Back Button -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <button (click)="goBack()" 
            class="h-9 w-9 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100">
            <mat-icon class="!text-[20px]">arrow_back</mat-icon>
          </button>
          <div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">Chi tiết hồ sơ đồ án</h2>
            <div class="flex items-center gap-2 mt-0.5 text-xs text-gray-500 font-medium italic">
              <span>Hệ thống</span>
              <mat-icon class="!text-[12px] !w-auto !h-auto">chevron_right</mat-icon>
              <span>Quản lý đồ án</span>
            </div>
          </div>
        </div>

        @if (thesis(); as t) {
          <div class="flex items-center gap-3">
            <span [class]="getStatusClass(t.status)" class="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border">
              {{ getStatusLabel(t.status) }}
            </span>
          </div>
        }
      </div>

      @if (loading()) {
        <div class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mb-3"></div>
          <p class="text-sm text-gray-400 font-medium">Đang tải dữ liệu...</p>
        </div>
      } @else if (error()) {
        <div class="p-8 bg-white rounded-2xl border border-red-100 text-center">
          <mat-icon class="text-red-400 text-4xl !w-10 !h-10 mb-3">report_problem</mat-icon>
          <h3 class="text-base font-bold text-gray-900 mb-1">Không thể tải thông tin</h3>
          <p class="text-sm text-gray-500 max-w-md mx-auto">{{ error() }}</p>
          <button (click)="loadThesis()" class="mt-4 px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all">
            Thử lại
          </button>
        </div>
      } @else if (thesis(); as t) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Info Column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Topic Section -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-start gap-4 mb-6">
                <div class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                  <mat-icon>description</mat-icon>
                </div>
                <div class="flex-1">
                  <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tên đề tài đồ án</h3>
                  <h4 class="text-lg font-bold text-gray-900 leading-snug">{{ t.topicName }}</h4>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 pt-5 border-t border-gray-50">
                <div class="flex items-center gap-3">
                  <mat-icon class="text-gray-300 !text-[18px]">event</mat-icon>
                  <div>
                    <p class="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Đợt đồ án</p>
                    <p class="text-xs font-semibold text-gray-700">{{ t.batchName }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <mat-icon class="text-gray-300 !text-[18px]">fingerprint</mat-icon>
                  <div>
                    <p class="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Mã đăng ký</p>
                    <p class="text-xs font-semibold text-gray-700 font-mono">{{ t.id.split('-')[0].toUpperCase() }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Progress List -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center gap-2 mb-6 text-gray-900">
                <mat-icon class="text-gray-400 !text-[20px]">sort</mat-icon>
                <h3 class="text-sm font-bold">Tiến trình thực hiện</h3>
              </div>
              
              <div class="space-y-6 relative ml-2">
                <div class="absolute left-3.5 top-0 bottom-0 w-px bg-gray-100"></div>
                
                <div class="flex gap-4 relative">
                  <div class="w-7 h-7 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center z-10">
                    <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                  </div>
                  <div class="flex-1 pt-0.5 pb-2">
                    <p class="text-sm font-bold text-gray-900">Khởi tạo hồ sơ</p>
                    <p class="text-xs text-gray-500 mt-1">Dữ liệu đồ án đã được hệ thống ghi nhận chính thức.</p>
                    <p class="mt-2 text-[10px] font-medium text-gray-400">Tự động • Đợt {{ t.batchName }}</p>
                  </div>
                </div>

                <div class="flex gap-4 relative grayscale opacity-40">
                  <div class="w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center z-10">
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                  </div>
                  <div class="flex-1 pt-1">
                    <p class="text-sm font-medium text-gray-400 italic">Các bước tiếp theo đang được cập nhật...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Column -->
          <div class="space-y-6">
            <!-- Student Card -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
               <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Sinh viên thực hiện</p>
               <div class="flex items-center gap-4 mb-5 pb-5 border-b border-gray-50">
                 <div class="h-12 w-12 rounded-xl bg-gray-900 text-white flex items-center justify-center text-lg font-bold">
                   {{ t.studentFirstName.charAt(0) }}
                 </div>
                 <div class="min-w-0">
                   <h4 class="text-sm font-bold text-gray-900 truncate">{{ t.studentLastName }} {{ t.studentFirstName }}</h4>
                   <p class="text-gray-400 text-xs font-mono">{{ t.studentCode }}</p>
                 </div>
               </div>
               <div class="space-y-3">
                 <div class="flex flex-col">
                   <span class="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Chuyên ngành</span>
                   <span class="text-xs font-semibold text-gray-700 mt-0.5">{{ t.majorName }}</span>
                 </div>
                 <div class="flex flex-col pt-2">
                   <span class="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Khoa / Viện</span>
                   <span class="text-xs font-semibold text-gray-700 mt-0.5">{{ t.facultyName }}</span>
                 </div>
               </div>
            </div>

            <!-- Advisor Card -->
            <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200/50">
               <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Hướng dẫn bởi</p>
               <div class="flex items-center gap-3 mb-5">
                 <div class="h-10 w-10 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center">
                   <mat-icon class="!text-[20px]">person</mat-icon>
                 </div>
                 <div>
                   <h4 class="text-sm font-bold text-gray-900">{{ t.advisorName }}</h4>
                   <p class="text-[10px] text-gray-400 font-medium italic">Giảng viên hướng dẫn</p>
                 </div>
               </div>
               <button class="w-full py-2.5 px-4 bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                 <mat-icon class="!text-[16px] !w-auto !h-auto">chat_bubble_outline</mat-icon>
                 Gửi tin nhắn
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
