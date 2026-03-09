import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProgressUpdateResponse {
    id: string;
    thesisId: string;
    weekNumber: number;
    title: string;
    description?: string;
    fileName?: string;
    fileSize?: number;
    publicUrl?: string;
    status: 'SUBMITTED' | 'REVIEWED' | 'NEEDS_REVISION';
    reviewerComment?: string;
    reviewerName?: string;
    reviewedAt?: string;
    submittedAt: string;
    studentName?: string;
    studentCode?: string;
    topicTitle?: string;
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/progress`;

    getFileUrl(publicUrl?: string): string {
        return publicUrl || '#';
    }

    submitProgress(weekNumber: number, title: string, description: string, file?: File): Observable<ProgressUpdateResponse> {
        const formData = new FormData();
        formData.append('weekNumber', weekNumber.toString());
        formData.append('title', title);
        if (description) formData.append('description', description);
        if (file) formData.append('file', file);
        return this.http.post<{ data: ProgressUpdateResponse }>(this.baseUrl, formData)
            .pipe(map(r => r.data));
    }

    getMyProgress(): Observable<ProgressUpdateResponse[]> {
        return this.http.get<{ data: ProgressUpdateResponse[] }>(`${this.baseUrl}/me`)
            .pipe(map(r => r.data));
    }

    getAdvisingProgress(): Observable<ProgressUpdateResponse[]> {
        return this.http.get<{ data: ProgressUpdateResponse[] }>(`${this.baseUrl}/advising`)
            .pipe(map(r => r.data));
    }

    reviewProgress(id: string, status: string, comment?: string): Observable<ProgressUpdateResponse> {
        return this.http.patch<{ data: ProgressUpdateResponse }>(`${this.baseUrl}/${id}/review`, { status, comment })
            .pipe(map(r => r.data));
    }
}
