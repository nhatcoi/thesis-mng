import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  template: `
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
         [class]="scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-indigo-500/5' : 'bg-transparent'">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <img src="/logo.svg" alt="ThesisHub" class="w-9 h-9">
            <span class="text-lg font-extrabold tracking-tight"
                  [class]="scrolled ? 'text-gray-900' : 'text-white'">
              ThesisHub<span class="text-indigo-500">.</span>
            </span>
          </div>
          <div class="hidden md:flex items-center gap-8">
            <a href="#features" class="text-sm font-semibold transition-colors hover:text-indigo-400"
               [class]="scrolled ? 'text-gray-600' : 'text-white/80'">Tính năng</a>
            <a href="#workflow" class="text-sm font-semibold transition-colors hover:text-indigo-400"
               [class]="scrolled ? 'text-gray-600' : 'text-white/80'">Quy trình</a>
            <a href="#roles" class="text-sm font-semibold transition-colors hover:text-indigo-400"
               [class]="scrolled ? 'text-gray-600' : 'text-white/80'">Vai trò</a>
          </div>
          <button (click)="goToLogin()"
            class="px-5 py-2.5 text-sm font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            [class]="scrolled
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30'
              : 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-white/20'">
            Đăng nhập
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900"></div>
      <!-- Grid pattern -->
      <div class="absolute inset-0 opacity-[0.04]"
           style="background-image: url('data:image/svg+xml,<svg width=&quot;60&quot; height=&quot;60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><rect width=&quot;60&quot; height=&quot;60&quot; fill=&quot;none&quot; stroke=&quot;white&quot; stroke-width=&quot;1&quot;/></svg>');
                  background-size: 60px 60px;"></div>
      <!-- Glow orbs -->
      <div class="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px]"></div>
      <div class="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]"></div>

      <div class="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-8">
          <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          <span class="text-xs font-semibold text-white/80 tracking-wide">Đại học Phenikaa • Năm học 2025 - 2026</span>
        </div>

        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
          Quản lý Đồ án
          <br>
          <span class="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Tốt nghiệp
          </span>
        </h1>

        <p class="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-medium">
          Nền tảng số hóa toàn bộ quy trình đồ án — từ đăng ký đề tài,
          theo dõi tiến độ đến bảo vệ và chấm điểm.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button (click)="goToLogin()"
            class="group px-8 py-4 bg-white text-indigo-700 font-bold text-base rounded-2xl shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3">
            <mat-icon>login</mat-icon>
            Bắt đầu ngay
            <mat-icon class="text-indigo-400 group-hover:translate-x-1 transition-transform">arrow_forward</mat-icon>
          </button>
          <a href="#features"
            class="px-8 py-4 text-white/80 font-semibold text-base rounded-2xl border border-white/20 hover:bg-white/10 transition-all flex items-center gap-2">
            <mat-icon>info</mat-icon>
            Tìm hiểu thêm
          </a>
        </div>

        <!-- Stats -->
        <div class="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div>
            <div class="text-3xl font-black text-white">3</div>
            <div class="text-xs text-white/40 font-semibold mt-1">Giai đoạn</div>
          </div>
          <div>
            <div class="text-3xl font-black text-white">5</div>
            <div class="text-xs text-white/40 font-semibold mt-1">Vai trò</div>
          </div>
          <div>
            <div class="text-3xl font-black text-white">15+</div>
            <div class="text-xs text-white/40 font-semibold mt-1">Tính năng</div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <mat-icon class="text-white/30 text-3xl">expand_more</mat-icon>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-xs font-bold text-indigo-600 tracking-[0.2em] uppercase">Tính năng</span>
          <h2 class="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Mọi thứ bạn cần, trong một nền tảng
          </h2>
          <p class="mt-4 text-base text-gray-500 max-w-xl mx-auto">
            Tích hợp đầy đủ các chức năng quản lý đồ án tốt nghiệp theo quy trình chuẩn.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (feature of features; track feature.title) {
            <div class="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                   [class]="feature.bgClass">
                <mat-icon [class]="feature.iconClass">{{ feature.icon }}</mat-icon>
              </div>
              <h3 class="text-base font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed">{{ feature.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Workflow Section -->
    <section id="workflow" class="py-24 bg-white">
      <div class="max-w-5xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-xs font-bold text-indigo-600 tracking-[0.2em] uppercase">Quy trình</span>
          <h2 class="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            3 giai đoạn của đồ án
          </h2>
        </div>

        <div class="relative">
          <!-- Timeline line -->
          <div class="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200"></div>

          @for (step of workflowSteps; track step.phase; let i = $index) {
            <div class="relative flex items-center mb-12 last:mb-0"
                 [class]="i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'">

              <!-- Dot on timeline -->
              <div class="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full items-center justify-center text-white text-sm font-black shadow-lg z-10"
                   [class]="step.dotClass">
                {{ i + 1 }}
              </div>

              <!-- Card -->
              <div class="w-full lg:w-[45%] bg-gradient-to-br rounded-2xl p-6 border"
                   [class]="step.cardClass">
                <div class="flex items-center gap-3 mb-3">
                  <div class="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black"
                       [class]="step.dotClass">{{ i + 1 }}</div>
                  <span class="text-xs font-bold tracking-[0.15em] uppercase" [class]="step.labelClass">{{ step.phase }}</span>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">{{ step.title }}</h3>
                <p class="text-sm text-gray-500 leading-relaxed">{{ step.desc }}</p>
                <div class="flex flex-wrap gap-2 mt-4">
                  @for (tag of step.tags; track tag) {
                    <span class="px-2.5 py-1 text-[10px] font-bold rounded-lg" [class]="step.tagClass">{{ tag }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Roles Section -->
    <section id="roles" class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-xs font-bold text-indigo-600 tracking-[0.2em] uppercase">Vai trò</span>
          <h2 class="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Phân quyền rõ ràng
          </h2>
          <p class="mt-4 text-base text-gray-500 max-w-xl mx-auto">
            Mỗi vai trò có giao diện và chức năng riêng biệt, tối ưu cho nghiệp vụ.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (role of roles; track role.name) {
            <div class="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" [class]="role.bgClass">
                <mat-icon [class]="role.iconClass">{{ role.icon }}</mat-icon>
              </div>
              <h3 class="text-base font-bold text-gray-900 mb-1">{{ role.name }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed">{{ role.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 relative overflow-hidden">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px]"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]"></div>

      <div class="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Sẵn sàng bắt đầu?
        </h2>
        <p class="mt-4 text-lg text-white/60 font-medium">
          Đăng nhập ngay bằng tài khoản SSO trường để trải nghiệm hệ thống.
        </p>
        <button (click)="goToLogin()"
          class="mt-8 px-8 py-4 bg-white text-indigo-700 font-bold text-base rounded-2xl shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all transform hover:scale-105 active:scale-95 inline-flex items-center gap-3">
          <mat-icon>vpn_key</mat-icon>
          Đăng nhập bằng SSO
          <mat-icon class="text-indigo-400">arrow_forward</mat-icon>
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 py-8">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img src="/logo.svg" alt="ThesisHub" class="w-7 h-7 brightness-200">
            <span class="text-sm font-bold text-white/80">ThesisHub PKA</span>
          </div>
          <p class="text-xs text-white/30 font-medium">
            © 
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }
    html { scroll-behavior: smooth; }
  `]
})
export class LandingComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  scrolled = false;

  features = [
    { icon: 'topic', title: 'Quản lý Đề tài', desc: 'Giảng viên tạo đề tài, sinh viên đề xuất hoặc đăng ký. Hỗ trợ phê duyệt tự động.', bgClass: 'bg-indigo-50 group-hover:bg-indigo-100', iconClass: 'text-indigo-600' },
    { icon: 'description', title: 'Đề cương & Tiến độ', desc: 'Nộp đề cương theo phiên bản, cập nhật tiến độ hàng tuần. Giảng viên nhận xét trực tiếp.', bgClass: 'bg-purple-50 group-hover:bg-purple-100', iconClass: 'text-purple-600' },
    { icon: 'gavel', title: 'Hội đồng Bảo vệ', desc: 'Tạo hội đồng, phân công thành viên, xếp lịch bảo vệ theo phòng và khung giờ.', bgClass: 'bg-amber-50 group-hover:bg-amber-100', iconClass: 'text-amber-600' },
    { icon: 'grade', title: 'Chấm điểm', desc: 'Chấm điểm chi tiết theo từng thành viên hội đồng, xét duyệt và công bố kết quả.', bgClass: 'bg-emerald-50 group-hover:bg-emerald-100', iconClass: 'text-emerald-600' },
    { icon: 'notifications_active', title: 'Thông báo', desc: 'Thông báo realtime qua WebSocket khi có thay đổi trạng thái: đăng ký, phê duyệt, điểm.', bgClass: 'bg-rose-50 group-hover:bg-rose-100', iconClass: 'text-rose-600' },
    { icon: 'security', title: 'SSO & Phân quyền', desc: 'Xác thực tập trung qua Zitadel SSO, phân quyền RBAC theo 5 vai trò hệ thống.', bgClass: 'bg-cyan-50 group-hover:bg-cyan-100', iconClass: 'text-cyan-600' },
  ];

  workflowSteps = [
    {
      phase: 'Giai đoạn 1', title: 'Đăng ký & Phê duyệt Đề tài',
      desc: 'Giảng viên tạo đề tài mở. Sinh viên tìm kiếm, đăng ký hoặc đề xuất đề tài mới. Trưởng ngành phê duyệt và phân công.',
      tags: ['Đề tài', 'Đăng ký', 'Phê duyệt'],
      dotClass: 'bg-indigo-600 shadow-indigo-500/40',
      cardClass: 'from-indigo-50/50 to-white border-indigo-100',
      labelClass: 'text-indigo-600',
      tagClass: 'bg-indigo-100 text-indigo-700',
    },
    {
      phase: 'Giai đoạn 2', title: 'Thực hiện & Theo dõi',
      desc: 'Sinh viên nộp đề cương, cập nhật tiến độ hàng tuần. Giảng viên hướng dẫn nhận xét và đánh giá.',
      tags: ['Đề cương', 'Tiến độ', 'Nhận xét'],
      dotClass: 'bg-purple-600 shadow-purple-500/40',
      cardClass: 'from-purple-50/50 to-white border-purple-100',
      labelClass: 'text-purple-600',
      tagClass: 'bg-purple-100 text-purple-700',
    },
    {
      phase: 'Giai đoạn 3', title: 'Bảo vệ & Chấm điểm',
      desc: 'Đăng ký bảo vệ, nộp tài liệu cuối kỳ, xếp lịch hội đồng. Chấm điểm và công bố kết quả.',
      tags: ['Bảo vệ', 'Hội đồng', 'Chấm điểm'],
      dotClass: 'bg-pink-600 shadow-pink-500/40',
      cardClass: 'from-pink-50/50 to-white border-pink-100',
      labelClass: 'text-pink-600',
      tagClass: 'bg-pink-100 text-pink-700',
    },
  ];

  roles = [
    { icon: 'admin_panel_settings', name: 'Quản trị viên', desc: 'Quản lý toàn hệ thống, cấu hình và phân quyền người dùng.', bgClass: 'bg-red-50', iconClass: 'text-red-600' },
    { icon: 'account_balance', name: 'Phòng Đào tạo', desc: 'Tạo đợt đồ án, thiết lập thời hạn và quản lý năm học.', bgClass: 'bg-purple-50', iconClass: 'text-purple-600' },
    { icon: 'manage_accounts', name: 'Trưởng ngành', desc: 'Phê duyệt đề tài, quản lý sinh viên và giảng viên trong ngành.', bgClass: 'bg-blue-50', iconClass: 'text-blue-600' },
    { icon: 'school', name: 'Giảng viên', desc: 'Tạo đề tài, hướng dẫn sinh viên, nhận xét tiến độ và chấm điểm.', bgClass: 'bg-emerald-50', iconClass: 'text-emerald-600' },
    { icon: 'person', name: 'Sinh viên', desc: 'Đăng ký đề tài, nộp đề cương, báo cáo tiến độ và đăng ký bảo vệ.', bgClass: 'bg-amber-50', iconClass: 'text-amber-600' },
  ];

  ngOnInit(): void {
    // If already logged in, redirect to dashboard
    const user = this.auth.currentUser();
    if (user) {
      this.router.navigate(['/dashboard']);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolled = window.scrollY > 50;
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
