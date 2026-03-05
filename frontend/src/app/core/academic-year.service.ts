import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AcademicYear {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
}

export interface AcademicYearRequest {
    name: string;
    startDate: string;
    endDate: string;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class AcademicYearService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/academic-years`;

    getAll(): Observable<AcademicYear[]> {
        return this.http.get<ApiResponse<AcademicYear[]>>(this.baseUrl).pipe(map(r => r.data));
    }

    create(req: AcademicYearRequest): Observable<AcademicYear> {
        return this.http.post<ApiResponse<AcademicYear>>(this.baseUrl, req).pipe(map(r => r.data));
    }

    update(id: string, req: AcademicYearRequest): Observable<AcademicYear> {
        return this.http.put<ApiResponse<AcademicYear>>(`${this.baseUrl}/${id}`, req).pipe(map(r => r.data));
    }

    delete(id: string): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(map(() => void 0));
    }
}
