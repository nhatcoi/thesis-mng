import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ProfileService, ProfileData } from '../../core/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="app-section-header">
        <h2 class="app-title">Thông tin cá nhân</h2>
        <p class="app-subtitle">Hồ sơ, trạng thái, và lịch sử hoạt động của bạn.</p>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      } @else if (data()) {
        <!-- ═══ 1. Thông tin tài khoản ═══ -->
        <div class="app-card !p-0 overflow-hidden">
          <div class="bg-white border-b border-gray-100 px-6 py-5 flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-sm shadow-indigo-100">
              {{ data()!.account.fullName.charAt(0) }}
            </div>
            <div>
              <h3 class="text-base font-black tracking-tight leading-tight text-gray-900">{{ data()!.account.fullName }}</h3>
              <p class="text-gray-400 text-xs font-bold mt-0.5">{{ data()!.account.username }}</p>
            </div>
            <div class="ml-auto flex flex-wrap gap-1.5">
              @for (r of data()!.account.roles; track r) {
                <span class="text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded italic">
                  {{ roleLabel(r) }}
                </span>
              }
            </div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
            <div class="bg-white p-4">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
              <p class="text-xs font-bold text-gray-900 mt-1 truncate">{{ data()!.account.email }}</p>
            </div>
            <div class="bg-white p-4">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">SĐT</p>
              <p class="text-xs font-bold text-gray-900 mt-1">{{ data()!.account.phone || '—' }}</p>
            </div>
            <div class="bg-white p-4">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</p>
              <p class="text-xs font-bold mt-1" [class]="data()!.account.status === 'ACTIVE' ? 'text-emerald-600' : 'text-gray-500'">
                {{ data()!.account.status === 'ACTIVE' ? '● Hoạt động' : data()!.account.status || '—' }}
              </p>
            </div>
            <div class="bg-white p-4">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đăng nhập gần nhất</p>
              <p class="text-xs font-bold text-gray-900 mt-1 font-mono">{{ data()!.account.lastLoginAt ? (data()!.account.lastLoginAt | date:'dd/MM/yyyy HH:mm') : '—' }}</p>
            </div>
          </div>
        </div>

        <!-- ═══ 2. Thông tin vai trò ═══ -->
        @if (data()!.student) {
          <div class="app-card !p-5 space-y-3">
            <div class="flex items-center gap-2">
              <mat-icon class="!text-indigo-500 !text-[18px]">school</mat-icon>
              <h3 class="text-sm font-black text-gray-900">Thông tin Sinh viên</h3>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã SV</p>
                <p class="text-xs font-bold text-gray-900 mt-0.5 font-mono">{{ data()!.student!.studentCode }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngành</p>
                <p class="text-xs font-bold text-gray-900 mt-0.5">{{ data()!.student!.majorCode }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Khóa / Lớp</p>
                <p class="text-xs font-bold text-gray-900 mt-0.5">{{ data()!.student!.cohort }} {{ data()!.student!.className ? '— ' + data()!.student!.className : '' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">ĐK Đồ án</p>
                <p class="text-xs font-bold mt-0.5" [class]="data()!.student!.eligibleForThesis ? 'text-emerald-600' : 'text-red-500'">
                  {{ data()!.student!.eligibleForThesis ? '✓ Đủ điều kiện' : '✗ Chưa đủ ĐK' }}
                </p>
              </div>
            </div>
          </div>
        }

        @if (data()!.lecturer) {
          <div class="app-card !p-5 space-y-3">
            <div class="flex items-center gap-2">
              <mat-icon class="!text-indigo-500 !text-[18px]">assignment_ind</mat-icon>
              <h3 class="text-sm font-black text-gray-900">Thông tin Giảng viên</h3>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã GV</p>
                <p class="text-xs font-bold text-gray-900 mt-0.5 font-mono">{{ data()!.lecturer!.lecturerCode }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Khoa</p>
                <p class="text-xs font-bold text-gray-900 mt-0.5">{{ data()!.lecturer!.facultyName || '—' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quota HD</p>
                <p class="text-xs font-bold text-gray-900 mt-0.5">{{ data()!.lecturer!.maxStudentsPerBatch ?? '—' }} SV/đợt</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngành quản lý</p>
                <p class="text-xs font-bold text-gray-900 mt-0.5">{{ data()!.lecturer!.managedMajorCode || '—' }}</p>
              </div>
            </div>
          </div>
        }

        <!-- ═══ 3. Tình trạng hiện tại ═══ -->
        @if (data()!.currentSituation) {
          <div class="app-card !p-5 space-y-3">
            <div class="flex items-center gap-2">
              <mat-icon class="!text-indigo-500 !text-[18px]">timeline</mat-icon>
              <h3 class="text-sm font-black text-gray-900">Tình trạng hiện tại</h3>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đợt ĐATN</p>
                <p class="text-xs font-bold text-indigo-600 mt-0.5">{{ data()!.currentSituation!.batchName }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</p>
                <p class="text-xs font-bold mt-0.5" [class]="getStatusColor(data()!.currentSituation!.thesisStatus)">
                  {{ getStatusLabel(data()!.currentSituation!.thesisStatus) }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đề tài</p>
                <p class="text-xs font-bold text-gray-900 mt-0.5">{{ data()!.currentSituation!.topicTitle || '—' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">GVHD</p>
                <p class="text-xs font-bold text-gray-900 mt-0.5">{{ data()!.currentSituation!.advisorName || '—' }}</p>
              </div>
            </div>

            <!-- Timeline -->
            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mốc thời gian</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                @for (phase of timelinePhases; track phase.key) {
                  <div class="text-center">
                    <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">{{ phase.label }}</p>
                    @if (data()!.currentSituation!.timeline[phase.key + 'Start']) {
                      <p class="text-[10px] font-bold text-gray-600 mt-0.5 font-mono">
                        {{ data()!.currentSituation!.timeline[phase.key + 'Start'] | date:'dd/MM' }}
                        – {{ data()!.currentSituation!.timeline[phase.key + 'End'] | date:'dd/MM' }}
                      </p>
                    } @else {
                      <p class="text-[10px] text-gray-300 mt-0.5">—</p>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- ═══ 4. Hồ sơ / Lịch sử ═══ -->
        @if (data()!.outlines?.length || data()!.progresses?.length || data()!.defenses?.length) {
          <div class="app-card !p-5 space-y-4">
            <div class="flex items-center gap-2">
              <mat-icon class="!text-indigo-500 !text-[18px]">folder_open</mat-icon>
              <h3 class="text-sm font-black text-gray-900">Hồ sơ & Lịch sử nộp bài</h3>
            </div>

            <!-- Tabs -->
            <div class="flex gap-2 flex-wrap">
              @for (tab of historyTabs; track tab.key) {
                @if (getTabCount(tab.key) > 0) {
                  <button (click)="activeHistoryTab.set(tab.key)"
                    class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                    [class]="activeHistoryTab() === tab.key
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                      : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'">
                    {{ tab.label }} ({{ getTabCount(tab.key) }})
                  </button>
                }
              }
            </div>

            <!-- Outlines -->
            @if (activeHistoryTab() === 'outlines' && data()!.outlines?.length) {
              <div class="space-y-2">
                @for (o of data()!.outlines; track o.id) {
                  <div class="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span class="app-badge !text-[9px] !px-2 !py-0.5 !font-black"
                      [class]="o.status === 'APPROVED' ? '!bg-emerald-50 !text-emerald-600' : o.status === 'REJECTED' ? '!bg-red-50 !text-red-600' : '!bg-amber-50 !text-amber-600'">
                      {{ o.status }}
                    </span>
                    <div class="flex-1 min-w-0">
                      <a [href]="o.publicUrl" target="_blank" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-4 decoration-indigo-200 truncate block">
                        {{ o.fileName }}
                      </a>
                    </div>
                    <span class="text-[10px] text-gray-400 font-mono shrink-0">v{{ o.version }} · {{ o.submittedAt | date:'dd/MM HH:mm' }}</span>
                  </div>
                }
              </div>
            }

            <!-- Progress updates -->
            @if (activeHistoryTab() === 'progresses' && data()!.progresses?.length) {
              <div class="space-y-2">
                @for (p of data()!.progresses; track p.id) {
                  <div class="py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div class="flex items-center gap-2">
                      <span class="app-badge !text-[9px] !px-2 !py-0.5 !font-black"
                        [class]="p.status === 'REVIEWED' ? '!bg-emerald-50 !text-emerald-600' : p.status === 'NEEDS_REVISION' ? '!bg-amber-50 !text-amber-600' : '!bg-blue-50 !text-blue-600'">
                        {{ p.status }}
                      </span>
                      <span class="text-xs font-bold text-gray-900">Tuần {{ p.weekNumber }}: {{ p.title }}</span>
                      <span class="ml-auto text-[10px] text-gray-400 font-mono">{{ p.submittedAt | date:'dd/MM HH:mm' }}</span>
                    </div>
                    @if (p.reviewerComment) {
                      <p class="text-[10px] text-gray-500 mt-1 pl-2 border-l-2 border-indigo-200">{{ p.reviewerComment }}</p>
                    }
                  </div>
                }
              </div>
            }

            <!-- Defense registrations -->
            @if (activeHistoryTab() === 'defenses' && data()!.defenses?.length) {
              <div class="space-y-2">
                @for (d of data()!.defenses; track d.id) {
                  <div class="py-2 px-3 bg-gray-50 rounded-lg border border-gray-100 space-y-1.5">
                    <div class="flex items-center gap-2">
                      <span class="app-badge !text-[9px] !px-2 !py-0.5 !font-black"
                        [class]="d.status === 'APPROVED' ? '!bg-emerald-50 !text-emerald-600' : d.status === 'REJECTED' ? '!bg-red-50 !text-red-600' : '!bg-blue-50 !text-blue-600'">
                        {{ d.status }}
                      </span>
                      <span class="text-xs font-bold text-gray-900">Đăng ký bảo vệ</span>
                      <span class="ml-auto text-[10px] text-gray-400 font-mono">{{ d.submittedAt | date:'dd/MM HH:mm' }}</span>
                    </div>
                    <div class="flex flex-wrap gap-3">
                      @if (d.reportUrl) {
                        <a [href]="d.reportUrl" target="_blank" class="text-[10px] text-indigo-600 font-bold underline underline-offset-4 decoration-indigo-200 flex items-center gap-1">
                          <mat-icon class="!text-[12px] !w-3 !h-3">description</mat-icon> {{ d.reportName }}
                        </a>
                      }
                      @if (d.sourceCodeUrl) {
                        <a [href]="d.sourceCodeUrl" target="_blank" class="text-[10px] text-indigo-600 font-bold underline underline-offset-4 decoration-indigo-200 flex items-center gap-1">
                          <mat-icon class="!text-[12px] !w-3 !h-3">code</mat-icon> {{ d.sourceCodeName }}
                        </a>
                      }
                      @if (d.slideUrl) {
                        <a [href]="d.slideUrl" target="_blank" class="text-[10px] text-indigo-600 font-bold underline underline-offset-4 decoration-indigo-200 flex items-center gap-1">
                          <mat-icon class="!text-[12px] !w-3 !h-3">slideshow</mat-icon> {{ d.slideName }}
                        </a>
                      }
                    </div>
                    @if (d.reviewerComment) {
                      <p class="text-[10px] text-gray-500 pl-2 border-l-2 border-indigo-200">{{ d.reviewerComment }}</p>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }
      }
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);

  loading = signal(true);
  data = signal<ProfileData | null>(null);
  activeHistoryTab = signal('outlines');

  timelinePhases = [
    { key: 'topicReg', label: 'Đăng ký ĐT' },
    { key: 'outline', label: 'Đề cương' },
    { key: 'implementation', label: 'Thực hiện' },
    { key: 'defenseReg', label: 'Xét bảo vệ' }
  ];

  historyTabs = [
    { key: 'outlines', label: 'Đề cương' },
    { key: 'progresses', label: 'Tiến độ' },
    { key: 'defenses', label: 'Bảo vệ' }
  ];

  ngOnInit(): void {
    this.profileService.getMyProfile().subscribe({
      next: (d) => {
        this.data.set(d);
        this.loading.set(false);
        // Auto-select first non-empty tab
        if (d.outlines?.length) this.activeHistoryTab.set('outlines');
        else if (d.progresses?.length) this.activeHistoryTab.set('progresses');
        else if (d.defenses?.length) this.activeHistoryTab.set('defenses');
      },
      error: () => this.loading.set(false)
    });
  }

  getTabCount(key: string): number {
    const d = this.data();
    if (!d) return 0;
    if (key === 'outlines') return d.outlines?.length ?? 0;
    if (key === 'progresses') return d.progresses?.length ?? 0;
    if (key === 'defenses') return d.defenses?.length ?? 0;
    return 0;
  }

  roleLabel(role: string): string {
    const map: Record<string, string> = {
      'ADMIN': 'Quản trị viên',
      'TRAINING_DEPT': 'P. Đào tạo',
      'DEPT_HEAD': 'Trưởng ngành',
      'LECTURER': 'Giảng viên',
      'STUDENT': 'Sinh viên'
    };
    return map[role] || role;
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'ELIGIBLE_FOR_THESIS': 'Đủ ĐK',
      'TOPIC_PENDING_APPROVAL': 'Chờ duyệt ĐT',
      'TOPIC_APPROVED': 'ĐT được duyệt',
      'TOPIC_ASSIGNED': 'ĐT được duyệt',
      'OUTLINE_SUBMITTED': 'Chờ duyệt ĐC',
      'OUTLINE_APPROVED': 'ĐC được duyệt',
      'IN_PROGRESS': 'Đang thực hiện',
      'DEFENSE_REQUESTED': 'Chờ duyệt BV',
      'DEFENSE_REJECTED': 'BV bị từ chối',
      'READY_FOR_DEFENSE': 'Sẵn sàng BV'
    };
    return map[status] || status;
  }

  getStatusColor(status: string): string {
    if (['READY_FOR_DEFENSE', 'OUTLINE_APPROVED', 'TOPIC_APPROVED', 'TOPIC_ASSIGNED'].includes(status)) return 'text-emerald-600';
    if (['DEFENSE_REJECTED', 'OUTLINE_REJECTED', 'TOPIC_REJECTED'].includes(status)) return 'text-red-600';
    return 'text-indigo-600';
  }
}
