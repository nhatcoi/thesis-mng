import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

/* ── Interfaces ──────────────────────────────────────────── */

export type BatchStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export interface ThesisBatch {
    id: string;
    name: string;
    academicYearId: string;
    academicYearName: string;
    semester: number;
    status: BatchStatus;
    createdById: string;
    createdByName: string;
    topicRegStart: string;
    topicRegEnd: string;
    outlineStart: string;
    outlineEnd: string;
    implementationStart: string;
    implementationEnd: string;
    defenseRegStart: string;
    defenseRegEnd: string;
    defenseStart: string | null;
    defenseEnd: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ThesisBatchCreateRequest {
    name: string;
    academicYearId: string;
    semester: number;
    topicRegStart: string;
    topicRegEnd: string;
    outlineStart: string;
    outlineEnd: string;
    implementationStart: string;
    implementationEnd: string;
    defenseRegStart: string;
    defenseRegEnd: string;
    defenseStart?: string;
    defenseEnd?: string;
}

export interface AcademicYear {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    timestamp: string;
}

/* ── Service ─────────────────────────────────────────────── */

@Injectable({ providedIn: 'root' })
export class BatchService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/batches`;
    private ayUrl = `${environment.apiUrl}/academic-years`;

    /* ── Academic Years ── */
    getAcademicYears(): Observable<AcademicYear[]> {
        return this.http.get<ApiResponse<AcademicYear[]>>(this.ayUrl).pipe(map(r => r.data));
    }

    /* ── Batch CRUD ── */
    listBatches(status?: BatchStatus): Observable<ThesisBatch[]> {
        let params = new HttpParams();
        if (status) params = params.set('status', status);
        return this.http.get<ApiResponse<ThesisBatch[]>>(this.baseUrl, { params }).pipe(map(r => r.data));
    }

    getBatch(id: string): Observable<ThesisBatch> {
        return this.http.get<ApiResponse<ThesisBatch>>(`${this.baseUrl}/${id}`).pipe(map(r => r.data));
    }

    createBatch(req: ThesisBatchCreateRequest): Observable<ThesisBatch> {
        return this.http.post<ApiResponse<ThesisBatch>>(this.baseUrl, req).pipe(map(r => r.data));
    }

    activateBatch(id: string): Observable<ThesisBatch> {
        return this.http.patch<ApiResponse<ThesisBatch>>(`${this.baseUrl}/${id}/activate`, {}).pipe(map(r => r.data));
    }

    closeBatch(id: string): Observable<ThesisBatch> {
        return this.http.patch<ApiResponse<ThesisBatch>>(`${this.baseUrl}/${id}/close`, {}).pipe(map(r => r.data));
    }

    deleteBatch(id: string): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(map(() => void 0));
    }
}
