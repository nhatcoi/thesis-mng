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
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isAssignMode() ? 'Gán sinh viên hàng loạt' : 'Danh sách Sinh viên Đồ án' }}
        </h2>
        <div class="flex gap-3">
          @if (!isAssignMode()) {
            <button (click)="toggleAssignMode()" 
              class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
              <mat-icon>person_add</mat-icon>
              Gán hàng loạt
            </button>
          } @else {
            <button (click)="toggleAssignMode()" 
              class="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
              <mat-icon>arrow_back</mat-icon>
              Quay lại danh sách
            </button>
            <button (click)="assignSelectedStudents()" 
              [disabled]="selectedStudentIds.size === 0 || !selectedBatchId"
              class="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all disabled:opacity-50 disabled:grayscale">
              <mat-icon>done_all</mat-icon>
              Xác nhận gán ({{ selectedStudentIds.size }})
            </button>
          }
        </div>
      </div>
      
      <div class="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
        <div class="p-6 border-b border-gray-100 bg-white">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row gap-4 items-center">
              <div class="relative flex-1 w-full">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pt-1">
                  <mat-icon class="text-gray-400">search</mat-icon>
                </span>
                <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearchQueryChange($event)"
                  [placeholder]="isAssignMode() ? 'Tìm sinh viên chưa gán...' : 'Tìm theo tên, email, mã sinh viên...'"
                  class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border transition-all">
              </div>
            </div>

            <div class="flex flex-wrap gap-4 items-center border-t border-gray-50 pt-6">
               <div class="w-full md:w-48">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1 block ml-1">Đợt đồ án</label>
                  <select [(ngModel)]="selectedBatchId" (change)="onFilterChange()"
                    class="block w-full px-3 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border transition-all">
                    @for (batch of batches(); track batch.id) {
                      <option [value]="batch.id">{{ batch.name }}</option>
                    }
                  </select>
               </div>

               <div class="w-full md:w-56">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1 block ml-1">Khoa đào tạo</label>
                  <select [(ngModel)]="facultyFilter" (change)="onFacultyChange()"
                    class="block w-full px-3 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border transition-all">
                    <option value="">Tất cả Khoa</option>
                    @for (f of faculties(); track f.id) {
                      <option [value]="f.id">{{ f.name }}</option>
                    }
                  </select>
               </div>

               <div class="w-full md:w-56">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1 block ml-1">Ngành học</label>
                  <select [(ngModel)]="majorFilter" (change)="onFilterChange()"
                    class="block w-full px-3 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border transition-all">
                    <option value="">Tất cả Ngành</option>
                    @for (m of filteredMajors(); track m.code) {
                      <option [value]="m.code">{{ m.name }}</option>
                    }
                  </select>
               </div>

               @if (!isAssignMode()) {
                <div class="w-full md:w-48">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1 block ml-1">Trạng thái</label>
                    <select [(ngModel)]="selectedStatus" (change)="onFilterChange()"
                      class="block w-full px-3 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border transition-all">
                      <option value="">Tất cả trạng thái</option>
                      <option value="ELIGIBLE_FOR_THESIS">Đủ điều kiện</option>
                      <option value="IN_PROGRESS">Đang thực hiện</option>
                      <option value="COMPLETED">Hoàn thành</option>
                      <option value="PASSED">Đạt</option>
                      <option value="FAILED">Không đạt</option>
                    </select>
                </div>
               }
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                @if (isAssignMode()) {
                  <th class="px-6 py-3 w-10 text-center">
                    <input type="checkbox" (change)="toggleSelectAll($event)" [checked]="isAllSelected()" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  </th>
                }
                <th (click)="toggleSort('student.studentCode')" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                   <div class="flex items-center gap-1">
                      Mã SV
                      <mat-icon class="!text-[14px] !w-auto !h-auto text-gray-400" *ngIf="sortBy() === 'studentCode'">{{ sortDir() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
                   </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Họ và Tên</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ngành / Khoa</th>
                <th (click)="toggleSort('status')" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                  Trạng thái
                </th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Đề tài / GVHD</th>
                <th class="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @if (loading()) {
                <tr>
                  <td colspan="7" class="px-6 py-12 text-center">
                    <div class="flex justify-center">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              } @else if (theses().length === 0) {
                <tr>
                  <td colspan="7" class="px-6 py-12 text-center text-gray-400 font-medium font-mono text-sm">
                    KHÔNG CÓ DỮ LIỆU
                  </td>
                </tr>
              } @else {
                @for (item of theses(); track (item.id || item.studentId)) {
                  <tr class="hover:bg-gray-50 transition-all cursor-pointer" [class.bg-indigo-50]="selectedStudentIds.has(item.studentId)" (click)="isAssignMode() ? toggleStudentSelect(item.studentId) : null">
                    @if (isAssignMode()) {
                      <td class="px-6 py-4 text-center" (click)="$event.stopPropagation()">
                        <input type="checkbox" [checked]="selectedStudentIds.has(item.studentId)" (change)="toggleStudentSelect(item.studentId)" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                      </td>
                    }
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold font-mono">
                      {{ item.studentCode }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-8 w-8 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 mr-3">
                           <span class="text-indigo-600 text-[11px] font-bold">{{ item.studentFirstName.substring(0, 1).toUpperCase() }}</span>
                        </div>
                        <div>
                           <div class="text-sm font-semibold text-gray-900">{{ item.studentLastName }} {{ item.studentFirstName }}</div>
                           <div class="text-[11px] text-gray-400">Sinh viên chính quy</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                       <div class="text-gray-900 font-bold mb-0.5">{{ item.majorName }}</div>
                       <div>{{ item.facultyName }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (item.status) {
                        <div class="flex flex-col gap-1">
                           <span [class]="getStatusClass(item.status)" class="px-2 py-0.5 inline-flex text-[11px] font-semibold rounded-md border w-fit">
                             {{ getStatusLabel(item.status) }}
                           </span>
                           <span class="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{{ item.batchName }}</span>
                        </div>
                      } @else {
                        <span class="px-2 py-0.5 inline-flex text-[11px] font-medium rounded-md border bg-gray-50 text-gray-400 border-gray-200 italic">
                          Chưa gán đợt
                        </span>
                      }
                    </td>
                    
                    <td class="px-6 py-4">
                      @if (item.id) {
                        <div class="text-sm font-medium text-gray-900 line-clamp-1 max-w-[250px]" [title]="item.topicName">
                          {{ item.topicName }}
                        </div>
                        <div class="mt-0.5 flex items-center gap-1">
                          <mat-icon class="!text-[12px] !w-auto !h-auto text-indigo-400">person</mat-icon>
                          <span class="text-[11px] text-gray-500 font-medium whitespace-nowrap">GV: {{ item.advisorName }}</span>
                        </div>
                      } @else {
                        <span class="text-xs text-gray-400 italic">Chưa có thông tin đồ án</span>
                      }
                    </td>

                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium" (click)="$event.stopPropagation()">
                      <div class="flex items-center justify-center gap-1.5">
                        <!-- Detail (Always) -->
                        <button (click)="onViewDetail(item.id || item.studentId)" class="p-2 hover:bg-white text-indigo-600 rounded-xl transition-all border border-transparent hover:border-indigo-100 hover:shadow-sm" [title]="item.id ? 'Xem hồ sơ đồ án' : 'Xem thông tin sinh viên'">
                          <mat-icon class="!text-[20px]">visibility</mat-icon>
                        </button>

                        @if (!isAssignMode()) {
                           @if (item.id) {
                              <!-- Unassign -->
                              <button (click)="onUnassign(item.id)" class="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-all border border-transparent hover:border-red-100" title="Gỡ khỏi đợt đồ án">
                                <mat-icon class="!text-[20px]">person_remove</mat-icon>
                              </button>
                           } @else {
                              <!-- Assign Single -->
                              <div class="relative group">
                                 <button class="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all border border-transparent hover:border-emerald-100" title="Gán vào đợt đồ án">
                                   <mat-icon class="!text-[20px]">add_circle</mat-icon>
                                 </button>
                                 <!-- Simple inline batch picker for single assign -->
                                 <div class="hidden group-hover:block absolute right-0 top-10 z-20 bg-white shadow-xl border border-gray-100 rounded-xl p-2 min-w-[180px] text-left">
                                    <div class="text-[10px] font-bold text-gray-400 uppercase p-1.5 border-b mb-1">Chọn đợt gán</div>
                                    @for (b of batches(); track b.id) {
                                       <button (click)="onSingleAssign(item.studentId, b.id)" class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors truncate">
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

        <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
             Hiển thị <b>{{ theses().length }}</b> kết quả 
             @if (totalElements() > 0) {
                tổng số <b>{{ totalElements() }}</b>
             }
          </div>
          <div class="flex space-x-2">
             <button (click)="changePage(-1)" [disabled]="page() === 0" class="px-4 py-1.5 border rounded-xl bg-white text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-40 shadow-sm border-gray-200">Trước</button>
             <button (click)="changePage(1)" [disabled]="(page() + 1) * 50 >= totalElements()" class="px-4 py-1.5 border rounded-xl bg-white text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-40 shadow-sm border-gray-200">Sau</button>
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
