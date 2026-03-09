import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProfileData {
    account: {
        fullName: string;
        email: string;
        phone?: string;
        username: string;
        status?: string;
        lastLoginAt?: string;
        roles: string[];
    };
    student?: {
        studentCode: string;
        majorCode: string;
        cohort: string;
        className?: string;
        eligibleForThesis?: boolean;
    };
    lecturer?: {
        lecturerCode: string;
        facultyName?: string;
        maxStudentsPerBatch?: number;
        managedMajorCode?: string;
    };
    currentSituation?: {
        batchName: string;
        thesisStatus: string;
        topicTitle?: string;
        advisorName?: string;
        timeline: Record<string, string>;
    };
    outlines?: any[];
    progresses?: any[];
    defenses?: any[];
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private http = inject(HttpClient);

    getMyProfile(): Observable<ProfileData> {
        return this.http.get<{ data: ProfileData }>(`${environment.apiUrl}/profile/me`)
            .pipe(map(r => r.data));
    }
}
