import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RowError {
    rowNumber: number;
    identifier: string;
    message: string;
}

export interface ImportResult {
    successCount: number;
    failureCount: number;
    errors: RowError[];
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class ImportService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/import`;

    importStudents(file: File): Observable<ImportResult> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<ApiResponse<ImportResult>>(`${this.baseUrl}/students`, formData)
            .pipe(map(r => r.data));
    }

    importLecturers(file: File): Observable<ImportResult> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<ApiResponse<ImportResult>>(`${this.baseUrl}/lecturers`, formData)
            .pipe(map(r => r.data));
    }
}
