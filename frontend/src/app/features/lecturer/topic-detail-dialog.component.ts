import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TopicService, TopicDetail } from '../../core/topic.service';

@Component({
  selector: 'app-topic-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="topic-detail-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <div class="header-content">
          <div class="header-title-row">
            @if (detail()) {
              <span [class]="getStatusClass(detail()!.status)" class="app-badge status-badge">
                {{ getStatusLabel(detail()!.status) }}
              </span>
            }
            <h2 class="dialog-title">Chi tiết đề tài</h2>
          </div>
          <p class="dialog-subtitle">Thông tin đầy đủ về đề tài đồ án.</p>
        </div>
        <button (click)="onClose()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p class="loading-text">Đang tải thông tin...</p>
        </div>
      } @else if (error()) {
        <div class="error-container">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <p>{{ error() }}</p>
        </div>
      } @else if (detail()) {
        <div class="detail-body">

          <!-- ═══ THÔNG TIN CHÍNH ═══ -->
          <section class="detail-section">
            <div class="section-header">
              <mat-icon class="section-icon">description</mat-icon>
              <h3 class="section-title">Thông tin chính</h3>
            </div>
            <div class="section-content">
              <h4 class="topic-title-display">{{ detail()!.title }}</h4>

              @if (detail()!.description) {
                <div class="info-block">
                  <label class="info-label">Mô tả chi tiết</label>
                  <p class="info-text">{{ detail()!.description }}</p>
                </div>
              }

              @if (detail()!.requirements) {
                <div class="info-block">
                  <label class="info-label">Yêu cầu chuyên môn</label>
                  <p class="info-text">{{ detail()!.requirements }}</p>
                </div>
              }

              <div class="info-row">
                <div class="info-chip">
                  <mat-icon class="chip-icon">source</mat-icon>
                  <span>Nguồn: {{ getSourceLabel(detail()!.source) }}</span>
                </div>
                <div class="info-chip">
                  <mat-icon class="chip-icon">event</mat-icon>
                  <span>Ngày tạo: {{ detail()!.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
              </div>

              @if (detail()!.status === 'REJECTED' && detail()!.rejectReason) {
                <div class="reject-reason">
                  <mat-icon class="reject-icon">warning</mat-icon>
                  <div>
                    <span class="reject-label">Lý do từ chối</span>
                    <p class="reject-text">{{ detail()!.rejectReason }}</p>
                  </div>
                </div>
              }
            </div>
          </section>

          <!-- ═══ PHẠM VI ═══ -->
          <section class="detail-section">
            <div class="section-header">
              <mat-icon class="section-icon">category</mat-icon>
              <h3 class="section-title">Phạm vi</h3>
            </div>
            <div class="section-content">
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon class="item-icon">school</mat-icon>
                  <div>
                    <label class="info-label">Ngành</label>
                    <p class="info-value">{{ detail()!.majorName || 'Chung (Cả khoa)' }}</p>
                  </div>
                </div>
                @if (detail()!.facultyName) {
                  <div class="info-item">
                    <mat-icon class="item-icon">account_balance</mat-icon>
                    <div>
                      <label class="info-label">Khoa</label>
                      <p class="info-value">{{ detail()!.facultyName }}</p>
                    </div>
                  </div>
                }
                <div class="info-item">
                  <mat-icon class="item-icon">date_range</mat-icon>
                  <div>
                    <label class="info-label">Đợt đồ án</label>
                    <p class="info-value">{{ detail()!.batchName }}</p>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon class="item-icon">groups</mat-icon>
                  <div>
                    <label class="info-label">Số SV tối đa</label>
                    <p class="info-value">{{ detail()!.maxStudents }} sinh viên</p>
                  </div>
                </div>
              </div>

              <!-- Slot status bar -->
              <div class="slot-bar-container">
                <div class="slot-bar-header">
                  <span class="slot-label">Tình trạng slot</span>
                  <span class="slot-count">
                    <strong>{{ detail()!.currentStudents }}</strong> / {{ detail()!.maxStudents }} đã đăng ký
                    ·
                    <span [class]="detail()!.availableSlots > 0 ? 'slots-available' : 'slots-full'">
                      {{ detail()!.availableSlots > 0 ? detail()!.availableSlots + ' slot trống' : 'Đã đầy' }}
                    </span>
                  </span>
                </div>
                <div class="slot-bar">
                  <div class="slot-bar-fill"
                    [style.width.%]="(detail()!.currentStudents / detail()!.maxStudents) * 100">
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ═══ GIẢNG VIÊN ═══ -->
          <section class="detail-section">
            <div class="section-header">
              <mat-icon class="section-icon">person</mat-icon>
              <h3 class="section-title">Giảng viên hướng dẫn</h3>
            </div>
            <div class="section-content">
              <div class="lecturer-card">
                <div class="lecturer-avatar">
                  <mat-icon>person</mat-icon>
                </div>
                <div class="lecturer-info">
                  <h4 class="lecturer-name">{{ detail()!.lecturerName }}</h4>
                  @if (detail()!.lecturerCode) {
                    <span class="lecturer-code">{{ detail()!.lecturerCode }}</span>
                  }
                  <div class="lecturer-details">
                    @if (detail()!.lecturerFacultyName) {
                      <span class="lecturer-detail">
                        <mat-icon>account_balance</mat-icon> {{ detail()!.lecturerFacultyName }}
                      </span>
                    }
                    @if (detail()!.lecturerEmail) {
                      <span class="lecturer-detail">
                        <mat-icon>email</mat-icon> {{ detail()!.lecturerEmail }}
                      </span>
                    }
                    @if (detail()!.lecturerPhone) {
                      <span class="lecturer-detail">
                        <mat-icon>phone</mat-icon> {{ detail()!.lecturerPhone }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ═══ DANH SÁCH SINH VIÊN ═══ -->
          <section class="detail-section">
            <div class="section-header">
              <mat-icon class="section-icon">people</mat-icon>
              <h3 class="section-title">Danh sách sinh viên</h3>
            </div>
            <div class="section-content">

              <!-- Tab: Đang làm (Assigned) -->
              @if (detail()!.assignedStudents.length > 0) {
                <div class="student-group">
                  <div class="student-group-header">
                    <span class="group-badge assigned">
                      <mat-icon class="!text-xs">check_circle</mat-icon>
                      Đang thực hiện ({{ detail()!.assignedStudents.length }})
                    </span>
                  </div>
                  <div class="student-table-wrapper">
                    <table class="student-table">
                      <thead>
                        <tr>
                          <th>Sinh viên</th>
                          <th>Mã SV</th>
                          <th>Ngành</th>
                          <th>Trạng thái ĐA</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (s of detail()!.assignedStudents; track s.studentId) {
                          <tr>
                            <td class="student-name-cell">{{ s.studentName }}</td>
                            <td><code class="student-code-badge">{{ s.studentCode }}</code></td>
                            <td>{{ s.majorName || s.majorCode || '—' }}</td>
                            <td>
                              <span [class]="getThesisStatusClass(s.thesisStatus)" class="app-badge mini-badge">
                                {{ getThesisStatusLabel(s.thesisStatus) }}
                              </span>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }

              <!-- Tab: Đăng ký (Registered) -->
              @if (detail()!.registeredStudents.length > 0) {
                <div class="student-group" [class.mt-4]="detail()!.assignedStudents.length > 0">
                  <div class="student-group-header">
                    <span class="group-badge registered">
                      <mat-icon class="!text-xs">how_to_reg</mat-icon>
                      Đã đăng ký ({{ detail()!.registeredStudents.length }})
                    </span>
                  </div>
                  <div class="student-table-wrapper">
                    <table class="student-table">
                      <thead>
                        <tr>
                          <th>Sinh viên</th>
                          <th>Mã SV</th>
                          <th>Ngành</th>
                          <th>Trạng thái ĐK</th>
                          <th>Ngày ĐK</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (s of detail()!.registeredStudents; track s.studentId) {
                          <tr>
                            <td class="student-name-cell">{{ s.studentName }}</td>
                            <td><code class="student-code-badge">{{ s.studentCode }}</code></td>
                            <td>{{ s.majorName || s.majorCode || '—' }}</td>
                            <td>
                              <span [class]="getRegStatusClass(s.registrationStatus)" class="app-badge mini-badge">
                                {{ getRegStatusLabel(s.registrationStatus) }}
                              </span>
                            </td>
                            <td class="date-cell">{{ s.registeredAt | date:'dd/MM/yyyy' }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }

              @if (detail()!.assignedStudents.length === 0 && detail()!.registeredStudents.length === 0) {
                <div class="empty-students">
                  <mat-icon class="empty-icon">person_search</mat-icon>
                  <p>Chưa có sinh viên nào đăng ký hoặc được gán cho đề tài này.</p>
                </div>
              }

            </div>
          </section>
        </div>
      }
    </div>
  `,
  styles: [`
    .topic-detail-dialog {
      max-height: 85vh;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px 28px 16px;
      border-bottom: 1px solid #f3f4f6;
    }

    .header-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }

    .dialog-title {
      font-size: 17px;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.02em;
    }

    .dialog-subtitle {
      font-size: 11px;
      color: #9ca3af;
      font-style: italic;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      transition: all 0.15s;
    }
    .close-btn:hover {
      color: #374151;
      background: #f3f4f6;
    }

    .status-badge {
      font-size: 10px;
      padding: 3px 10px;
      border-radius: 20px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* Loading & Error */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 0;
      gap: 12px;
    }
    .spinner {
      width: 28px;
      height: 28px;
      border: 2.5px solid #e5e7eb;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-text { font-size: 12px; color: #9ca3af; }

    .error-container {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 20px 28px;
      color: #dc2626;
      font-size: 13px;
    }
    .error-icon { color: #dc2626; }

    /* Body */
    .detail-body {
      overflow-y: auto;
      padding: 4px 0;
    }

    /* Section */
    .detail-section {
      padding: 16px 28px;
      border-bottom: 1px solid #f9fafb;
    }
    .detail-section:last-child {
      border-bottom: none;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
    }
    .section-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #6366f1;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .section-content {
      padding-left: 26px;
    }

    /* Topic title display */
    .topic-title-display {
      font-size: 15px;
      font-weight: 700;
      color: #111827;
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .info-block {
      margin-bottom: 12px;
    }
    .info-label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    .info-text {
      font-size: 13px;
      color: #4b5563;
      line-height: 1.6;
      white-space: pre-wrap;
      margin: 0;
    }

    .info-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 8px;
    }
    .info-chip {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #6b7280;
      background: #f9fafb;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #f3f4f6;
    }
    .chip-icon {
      font-size: 14px !important;
      width: 14px !important;
      height: 14px !important;
      color: #9ca3af;
    }

    /* Reject reason */
    .reject-reason {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      padding: 10px 14px;
      background: #fef2f2;
      border: 1px solid #fee2e2;
      border-radius: 8px;
    }
    .reject-icon {
      color: #f87171;
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-top: 2px;
    }
    .reject-label {
      font-size: 10px;
      font-weight: 700;
      color: #dc2626;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .reject-text {
      font-size: 12px;
      color: #991b1b;
      margin: 2px 0 0;
      font-style: italic;
    }

    /* Info grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .item-icon {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
      color: #9ca3af;
      margin-top: 2px;
    }
    .info-value {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    /* Slot bar */
    .slot-bar-container {
      margin-top: 16px;
      padding: 12px 14px;
      background: #fafafa;
      border-radius: 8px;
      border: 1px solid #f3f4f6;
    }
    .slot-bar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .slot-label {
      font-size: 10px;
      font-weight: 700;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .slot-count {
      font-size: 11px;
      color: #6b7280;
    }
    .slots-available { color: #059669; font-weight: 700; }
    .slots-full { color: #dc2626; font-weight: 700; }

    .slot-bar {
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
    }
    .slot-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1, #818cf8);
      border-radius: 3px;
      transition: width 0.5s ease;
      min-width: 2px;
    }

    /* Lecturer card */
    .lecturer-card {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 14px 16px;
      background: #fafafa;
      border-radius: 10px;
      border: 1px solid #f3f4f6;
    }
    .lecturer-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }
    .lecturer-avatar mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }
    .lecturer-info {
      flex: 1;
      min-width: 0;
    }
    .lecturer-name {
      font-size: 14px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 2px;
    }
    .lecturer-code {
      font-size: 10px;
      color: #6366f1;
      font-weight: 600;
      background: #eef2ff;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .lecturer-details {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 8px;
    }
    .lecturer-detail {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #6b7280;
    }
    .lecturer-detail mat-icon {
      font-size: 14px !important;
      width: 14px !important;
      height: 14px !important;
      color: #9ca3af;
    }

    /* Student groups */
    .student-group {
      margin-bottom: 4px;
    }
    .student-group-header {
      margin-bottom: 8px;
    }
    .group-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .group-badge.assigned {
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #d1fae5;
    }
    .group-badge.registered {
      background: #eff6ff;
      color: #3b82f6;
      border: 1px solid #dbeafe;
    }

    /* Student table */
    .student-table-wrapper {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #f3f4f6;
    }
    .student-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    .student-table thead {
      background: #fafafa;
    }
    .student-table th {
      text-align: left;
      padding: 8px 12px;
      font-size: 10px;
      font-weight: 700;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #f3f4f6;
    }
    .student-table td {
      padding: 10px 12px;
      color: #374151;
      border-bottom: 1px solid #f9fafb;
    }
    .student-table tbody tr:last-child td {
      border-bottom: none;
    }
    .student-table tbody tr:hover {
      background: #fafbfc;
    }
    .student-name-cell {
      font-weight: 600;
      color: #111827 !important;
    }
    .student-code-badge {
      font-size: 11px;
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      color: #4b5563;
      font-family: 'JetBrains Mono', monospace;
    }
    .date-cell {
      font-size: 11px;
      color: #9ca3af !important;
    }

    .mini-badge {
      font-size: 9px !important;
      padding: 2px 8px !important;
      border-radius: 12px !important;
      font-weight: 700 !important;
    }

    /* Empty students */
    .empty-students {
      text-align: center;
      padding: 28px 0;
      color: #9ca3af;
    }
    .empty-icon {
      font-size: 32px !important;
      width: 32px !important;
      height: 32px !important;
      color: #d1d5db;
      margin-bottom: 8px;
    }
    .empty-students p {
      font-size: 12px;
      margin: 0;
    }
  `]
})
export class TopicDetailDialogComponent implements OnInit {
  private topicService = inject(TopicService);

  detail = signal<TopicDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    public dialogRef: MatDialogRef<TopicDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { topicId: string }
  ) {}

  ngOnInit(): void {
    this.loadDetail();
  }

  loadDetail(): void {
    this.loading.set(true);
    this.error.set(null);
    this.topicService.getTopicDetail(this.data.topicId).subscribe({
      next: (res) => {
        this.detail.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Không thể tải thông tin đề tài.');
        this.loading.set(false);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  // === Status helpers ===
  getStatusLabel(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'Sẵn sàng';
      case 'PENDING_APPROVAL': return 'Chờ duyệt';
      case 'APPROVED': return 'Đã duyệt';
      case 'REJECTED': return 'Từ chối';
      case 'FULL': return 'Đã đầy';
      case 'CLOSED': return 'Đã đóng';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'PENDING_APPROVAL': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'APPROVED': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'FULL': return 'bg-gray-50 text-gray-500 border border-gray-100';
      case 'CLOSED': return 'bg-gray-100 text-gray-500 border border-gray-200';
      default: return 'bg-gray-50 text-gray-600';
    }
  }

  getSourceLabel(source: string): string {
    switch (source) {
      case 'LECTURER': return 'Giảng viên đề xuất';
      case 'STUDENT': return 'Sinh viên đề xuất';
      case 'DEPT_HEAD': return 'Trưởng bộ môn';
      default: return source;
    }
  }

  getThesisStatusLabel(status?: string): string {
    if (!status) return '—';
    switch (status) {
      case 'NOT_ELIGIBLE': return 'Chưa đủ ĐK';
      case 'ELIGIBLE_FOR_THESIS': return 'Đủ điều kiện';
      case 'TOPIC_PENDING_APPROVAL': return 'Chờ duyệt đề tài';
      case 'TOPIC_APPROVED': return 'ĐT đã duyệt';
      case 'TOPIC_REJECTED': return 'ĐT bị từ chối';
      case 'TOPIC_ASSIGNED': return 'Đã gán đề tài';
      case 'OUTLINE_SUBMITTED': return 'Đã nộp ĐC';
      case 'OUTLINE_APPROVED': return 'ĐC đã duyệt';
      case 'OUTLINE_REJECTED': return 'ĐC bị từ chối';
      case 'IN_PROGRESS': return 'Đang thực hiện';
      case 'DEFENSE_REQUESTED': return 'YC bảo vệ';
      case 'DEFENSE_APPROVED': return 'Duyệt bảo vệ';
      case 'READY_FOR_DEFENSE': return 'Sẵn sàng BV';
      case 'DEFENDING': return 'Đang bảo vệ';
      case 'GRADED': return 'Đã chấm';
      case 'PASSED': return 'Đạt';
      case 'FAILED': return 'Không đạt';
      case 'COMPLETED': return 'Hoàn thành';
      default: return status;
    }
  }

  getThesisStatusClass(status?: string): string {
    if (!status) return 'bg-gray-50 text-gray-400';
    switch (status) {
      case 'IN_PROGRESS':
      case 'TOPIC_ASSIGNED':
      case 'OUTLINE_APPROVED':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'PASSED':
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'FAILED':
      case 'TOPIC_REJECTED':
      case 'OUTLINE_REJECTED':
      case 'DEFENSE_REJECTED':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'DEFENSE_REQUESTED':
      case 'READY_FOR_DEFENSE':
      case 'DEFENDING':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      default:
        return 'bg-gray-50 text-gray-500 border border-gray-100';
    }
  }

  getRegStatusLabel(status?: string): string {
    if (!status) return '—';
    switch (status) {
      case 'PENDING': return 'Chờ duyệt';
      case 'APPROVED': return 'Chấp nhận';
      case 'REJECTED': return 'Từ chối';
      default: return status;
    }
  }

  getRegStatusClass(status?: string): string {
    if (!status) return 'bg-gray-50 text-gray-400';
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border border-rose-100';
      default: return 'bg-gray-50 text-gray-500';
    }
  }
}
