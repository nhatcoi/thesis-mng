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
}

@Injectable({ providedIn: 'root' })
export class OutlineService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/outlines`;

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
}
