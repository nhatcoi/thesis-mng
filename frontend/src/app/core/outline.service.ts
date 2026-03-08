import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OutlineResponse {
    id: string;
    thesisId: string;
    version: number;
    fileName: string;
    fileSize: number;
    status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    reviewerComment?: string;
    reviewerName?: string;
    reviewedAt?: string;
    submittedAt: string;
    studentName?: string;
    studentCode?: string;
    topicTitle?: string;
    publicUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class OutlineService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/outlines`;

    getFileUrl(publicUrl?: string): string {
        return publicUrl || '#';
    }

    submitOutline(file: File): Observable<OutlineResponse> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ data: OutlineResponse }>(this.baseUrl, formData)
            .pipe(map(r => r.data));
    }

    getMyOutlines(): Observable<OutlineResponse[]> {
        return this.http.get<{ data: OutlineResponse[] }>(`${this.baseUrl}/me`)
            .pipe(map(r => r.data));
    }

    getAdvisingOutlines(): Observable<OutlineResponse[]> {
        return this.http.get<{ data: OutlineResponse[] }>(`${this.baseUrl}/advising`)
            .pipe(map(r => r.data));
    }

    reviewOutline(id: string, status: string, comment?: string): Observable<OutlineResponse> {
        return this.http.patch<{ data: OutlineResponse }>(`${this.baseUrl}/${id}/review`, { status, comment })
            .pipe(map(r => r.data));
    }
}
