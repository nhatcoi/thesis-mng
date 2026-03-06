import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ThesisService, ThesisResponse } from '../../core/thesis.service';
import { BatchService, Batch } from '../../core/batch.service';
import { AuthService } from '../../core/auth.service';
import { UserService } from '../../core/user.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-head-students',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  template: `
    <div class="space-y-4">
      <!-- Header -->
      <div class="app-section-header flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 class="app-title">
            {{ isAssignMode() ? 'Gán sinh viên hàng loạt' : 'Danh sách Sinh viên Đồ án' }}
          </h2>
          <p class="app-subtitle">Quản lý sinh viên đủ điều kiện và thực hiện đồ án trong các đợt.</p>
        </div>
        <div class="flex gap-2">
          @if (!isAssignMode()) {
            <button (click)="toggleAssignMode()" class="app-btn-primary">
              <mat-icon class="mr-1.5 !text-base">person_add</mat-icon> Gán hàng loạt
            </button>
          } @else {
            <button (click)="toggleAssignMode()" class="app-btn-secondary">
              <mat-icon class="mr-1.5 !text-base">arrow_back</mat-icon> Quay lại
            </button>
            <button (click)="assignSelectedStudents()" 
              [disabled]="selectedStudentIds.size === 0 || !selectedBatchId"
              class="app-btn-primary !bg-emerald-600 hover:!bg-emerald-700">
              <mat-icon class="mr-1.5 !text-base">done_all</mat-icon>
              Xác nhận gán ({{ selectedStudentIds.size }})
            </button>
          }
        </div>
      </div>
      
      <div class="app-card">
        <!-- Filters Area -->
        <div class="p-4 border-b border-gray-100 bg-gray-50/30">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div class="md:col-span-2 relative">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 !text-base text-gray-400">search</mat-icon>
              <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearchQueryChange($event)"
                [placeholder]="isAssignMode() ? 'Tìm sinh viên chưa gán...' : 'Tìm tên, mã SV...'"
                class="app-input pl-9">
            </div>

            <select [(ngModel)]="selectedBatchId" (change)="onFilterChange()" class="app-select">
              <option value="" disabled>Chọn đợt đồ án</option>
              @for (batch of batches(); track batch.id) {
                <option [value]="batch.id">{{ batch.name }}</option>
              }
            </select>

            <select [(ngModel)]="majorFilter" (change)="onFilterChange()" class="app-select">
              <option value="">Tất cả Ngành</option>
              @for (m of filteredMajors(); track m.code) {
                <option [value]="m.code">{{ m.name }}</option>
              }
            </select>

            @if (!isAssignMode()) {
              <select [(ngModel)]="selectedStatus" (change)="onFilterChange()" class="app-select">
                <option value="">Tất cả trạng thái</option>
                <option value="ELIGIBLE_FOR_THESIS">Đủ điều kiện</option>
                <option value="IN_PROGRESS">Đang thực hiện</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="PASSED">Đạt</option>
                <option value="FAILED">Không đạt</option>
              </select>
            }
          </div>
        </div>
        
        <!-- Table Area -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50/50 border-b border-gray-100">
              <tr>
                @if (isAssignMode()) {
                  <th class="p-3 w-10 text-center">
                    <input type="checkbox" (change)="toggleSelectAll($event)" [checked]="isAllSelected()" class="rounded border-gray-300 text-indigo-600">
                  </th>
                }
                <th (click)="toggleSort('student.studentCode')" class="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors">
                   Mã SV
                </th>
                <th class="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Họ và Tên</th>
                <th class="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ngành / Khoa</th>
                <th class="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Đề tài / GVHD</th>
                <th class="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @if (loading()) {
                <tr>
                  <td colspan="7" class="p-10 text-center">
                    <div class="flex justify-center"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div></div>
                  </td>
                </tr>
              } @else if (theses().length === 0) {
                <tr><td colspan="7" class="p-10 text-center text-xs text-gray-400 italic">KHÔNG CÓ DỮ LIỆU</td></tr>
              } @else {
                @for (item of theses(); track (item.id || item.studentId)) {
                  <tr class="hover:bg-gray-50 transition-colors cursor-pointer text-xs" 
                    [class.bg-indigo-50/30]="selectedStudentIds.has(item.studentId)" 
                    (click)="isAssignMode() ? toggleStudentSelect(item.studentId) : null">
                    @if (isAssignMode()) {
                      <td class="p-3 text-center" (click)="$event.stopPropagation()">
                        <input type="checkbox" [checked]="selectedStudentIds.has(item.studentId)" (change)="toggleStudentSelect(item.studentId)" class="rounded border-gray-300 text-indigo-600">
                      </td>
                    }
                    <td class="p-3 font-mono font-bold">{{ item.studentCode }}</td>
                    <td class="p-3">
                      <div class="font-bold text-gray-900">{{ item.studentLastName }} {{ item.studentFirstName }}</div>
                    </td>
                    <td class="p-3">
                       <div class="font-bold text-gray-700">{{ item.majorName }}</div>
                       <div class="text-[10px] text-gray-400">{{ item.facultyName }}</div>
                    </td>
                    <td class="p-3">
                      @if (item.status) {
                        <span [class]="getStatusClass(item.status)" class="app-badge">
                          {{ getStatusLabel(item.status) }}
                        </span>
                      } @else {
                        <span class="text-[10px] text-gray-400 italic">Chưa gán</span>
                      }
                    </td>
                    <td class="p-3">
                      @if (item.id) {
                        <div class="font-bold text-gray-900 line-clamp-1 max-w-[200px]" [title]="item.topicName">{{ item.topicName }}</div>
                        <div class="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <mat-icon class="!text-[12px]">person</mat-icon> GV: {{ item.advisorName }}
                        </div>
                      } @else {
                        <span class="text-[10px] text-gray-400 italic">Trống</span>
                      }
                    </td>
                    <td class="p-3 text-center" (click)="$event.stopPropagation()">
                      <div class="flex items-center justify-center gap-1">
                        <button (click)="onViewDetail(item.id || item.studentId)" class="app-btn-ghost" title="Xem chi tiết">
                          <mat-icon class="!text-lg">visibility</mat-icon>
                        </button>

                        @if (!isAssignMode()) {
                          @if (item.id) {
                            <button (click)="onUnassign(item.id)" class="app-btn-ghost hover:!text-red-500" title="Gỡ">
                              <mat-icon class="!text-lg">person_remove</mat-icon>
                            </button>
                          } @else {
                            <div class="relative group">
                              <button class="app-btn-ghost hover:!text-emerald-500" title="Gán">
                                <mat-icon class="!text-lg">add_circle</mat-icon>
                              </button>
                              <div class="hidden group-hover:block absolute right-0 top-full z-10 bg-white shadow-xl border border-gray-100 rounded-lg p-1 min-w-[150px] text-left">
                                @for (b of batches(); track b.id) {
                                  <button (click)="onSingleAssign(item.studentId, b.id)" class="w-full text-left px-3 py-1.5 text-[11px] hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors truncate">
                                    {{ b.name }}
                                  </button>
                                }
                              </div>
                            </div>
                          }
                        }
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Footer / Pagination -->
        <div class="p-3 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between text-[11px] text-gray-500 font-medium">
          <div>Hiển thị <b>{{ theses().length }}</b> kết quả (Tổng <b>{{ totalElements() }}</b>)</div>
          <div class="flex gap-2">
            <button (click)="changePage(-1)" [disabled]="page() === 0" class="app-btn-secondary !px-3 !py-1 disabled:opacity-30">Trước</button>
            <button (click)="changePage(1)" [disabled]="(page() + 1) * 50 >= totalElements()" class="app-btn-secondary !px-3 !py-1 disabled:opacity-30">Sau</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    button:disabled { cursor: not-allowed; }
    .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
  `]
})
export class StudentsComponent implements OnInit {
  private thesisService = inject(ThesisService);
  private batchService = inject(BatchService);
  private userService = inject(UserService);
  private router = inject(Router);
  auth = inject(AuthService);

  theses = signal<ThesisResponse[]>([]);
  batches = signal<Batch[]>([]);
  faculties = signal<any[]>([]);
  majors = signal<any[]>([]);

  loading = signal(false);
  isAssignMode = signal(false);
  selectedStudentIds = new Set<string>();

  totalElements = signal(0);
  page = signal(0);
  sortBy = signal('studentCode');
  sortDir = signal<'asc' | 'desc'>('asc');

  selectedBatchId = '';
  facultyFilter = '';
  majorFilter = '';
  selectedStatus = '';
  searchQuery = '';

  private searchSubject = new Subject<string>();

  filteredMajors() {
    if (!this.facultyFilter) return this.majors();
    return this.majors().filter(m => m.facultyId === this.facultyFilter);
  }

  isHead(): boolean {
    return (this.auth.currentUser()?.roles || []).includes('DEPT_HEAD');
  }

  isDeanOrHead(): boolean {
    const roles = this.auth.currentUser()?.roles || [];
    return roles.includes('DEPT_HEAD') || roles.includes('TRAINING_DEPT');
  }

  ngOnInit(): void {
    this.loadBatches();
    this.loadFaculties();
    this.loadMajors();
    this.initFilters();
    this.loadData();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.page.set(0);
      this.loadData();
    });
  }

  initFilters() {
    const user = this.auth.currentUser();
    if (!user) return;
    if (this.isHead()) {
      this.facultyFilter = user.facultyId || '';
      this.majorFilter = user.managedMajorCode || '';
    } else if (this.isDeanOrHead()) {
      this.facultyFilter = user.facultyId || '';
    }
  }

  loadFaculties() {
    this.userService.getFaculties().subscribe(data => this.faculties.set(data));
  }

  loadMajors() {
    this.userService.getMajors().subscribe(data => this.majors.set(data));
  }

  loadBatches() {
    this.batchService.listBatches({ size: 100 }).subscribe(res => {
      this.batches.set(res.content);
      if (!this.selectedBatchId && res.content.length > 0) {
        this.selectedBatchId = res.content[0].id;
        this.loadData();
      }
    });
  }

  loadData() {
    this.loading.set(true);
    const params: any = {
      batchId: this.selectedBatchId || undefined,
      majorCode: this.majorFilter,
      facultyId: this.majorFilter ? '' : this.facultyFilter,
      search: this.searchQuery,
      page: this.page(),
      size: 50,
      sort: `${this.sortBy()},${this.sortDir()}`
    };

    if (this.isAssignMode()) {
      params.unassignedOnly = true;
    } else {
      params.showAll = true;
      if (this.selectedStatus) {
        params.status = this.selectedStatus;
      }
    }

    this.thesisService.getTheses(params).subscribe({
      next: (res) => {
        this.theses.set(res.content);
        this.totalElements.set(res.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggleAssignMode() {
    if (!this.selectedBatchId && !this.isAssignMode()) {
      alert('Vui lòng chọn một đợt đồ án cụ thể để thực hiện gán hàng loạt.');
      return;
    }
    this.isAssignMode.update(v => !v);
    this.selectedStudentIds.clear();
    this.page.set(0);
    this.loadData();
  }

  toggleStudentSelect(id: string) {
    if (this.selectedStudentIds.has(id)) {
      this.selectedStudentIds.delete(id);
    } else {
      this.selectedStudentIds.add(id);
    }
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.theses().forEach(item => this.selectedStudentIds.add(item.studentId));
    } else {
      this.selectedStudentIds.clear();
    }
  }

  isAllSelected() {
    return this.theses().length > 0 && this.theses().every(item => this.selectedStudentIds.has(item.studentId));
  }

  assignSelectedStudents() {
    if (!this.selectedBatchId) return;
    this.loading.set(true);
    this.thesisService.assignStudents(this.selectedBatchId, Array.from(this.selectedStudentIds)).subscribe({
      next: () => {
        this.toggleAssignMode();
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  onSingleAssign(studentId: string, batchId: string) {
    this.loading.set(true);
    this.thesisService.assignStudents(batchId, [studentId]).subscribe({
      next: () => this.loadData(),
      error: () => this.loading.set(false)
    });
  }

  onUnassign(thesisId: string) {
    if (confirm('Bạn có chắc chắn muốn gỡ sinh viên này khỏi đợt đồ án (xóa hồ sơ)?')) {
      this.loading.set(true);
      this.thesisService.deleteThesis(thesisId).subscribe({
        next: () => this.loadData(),
        error: () => this.loading.set(false)
      });
    }
  }

  onFacultyChange() {
    this.majorFilter = '';
    this.onFilterChange();
  }

  onFilterChange() {
    this.page.set(0);
    this.loadData();
  }

  toggleSort(column: string) {
    if (this.sortBy() === column) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortDir.set('asc');
    }
    this.loadData();
  }

  onViewDetail(id: string) {
    // Navigate to thesis detail if it exists, otherwise maybe a student profile (future)
    // For now we navigate with whatever ID we have
    this.router.navigate(['/head/students/thesis', id]);
  }

  onSearchQueryChange(query: string) {
    this.searchSubject.next(query);
  }

  changePage(delta: number) {
    this.page.update(p => p + delta);
    this.loadData();
  }

  getStatusClass(status: string) {
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
