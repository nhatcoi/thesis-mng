import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export type Role = 'ADMIN' | 'TRAINING_DEPT' | 'DEPT_HEAD' | 'LECTURER' | 'STUDENT';

export interface User {
  sub: string;
  name: string;
  email: string;
  roles: Role[];
  activeRole: Role;
  localRole?: Role;
}

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Quản trị hệ thống',
  TRAINING_DEPT: 'Phòng Đào tạo',
  DEPT_HEAD: 'Trưởng ngành',
  LECTURER: 'Giảng viên',
  STUDENT: 'Sinh viên',
};

const ROLES_CLAIM = 'urn:zitadel:iam:org:project:roles';

const ROLE_HOME: Record<Role, string> = {
  ADMIN: '/pdt/batches',
  TRAINING_DEPT: '/pdt/batches',
  DEPT_HEAD: '/head/topics',
  LECTURER: '/lecturer/topics',
  STUDENT: '/dashboard',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private oauthService = inject(OAuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());

  private _readyResolve!: () => void;
  readonly ready$ = new Promise<void>(resolve => {
    this._readyResolve = resolve;
  });

  async init(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      this._readyResolve();
      return;
    }

    this.oauthService.configure({
      issuer: environment.sso.issuer,
      clientId: environment.sso.clientId,
      redirectUri: environment.sso.redirectUri,
      postLogoutRedirectUri: environment.sso.postLogoutRedirectUri,
      responseType: 'code',
      scope: environment.sso.scope,
      useSilentRefresh: false,
      showDebugInformation: !environment.production,
      requireHttps: environment.production,
    } satisfies AuthConfig);

    const hadTokenBefore = this.oauthService.hasValidAccessToken();

    try {
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();

      if (this.oauthService.hasValidAccessToken()) {
        // 1. Khởi tạo nháp từ Token
        this.buildUserFromToken();

        // 2. Lấy dữ liệu CHÍNH XÁC từ Backend
        try {
          const res = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/auth/me`));
          const backendUser = res.data;

          const backendRoles = (backendUser.roles || []) as Role[];
          const backendLocalRole = backendUser.local_role as Role;

          // Chọn active role
          const savedRole = sessionStorage.getItem('activeRole') as Role;
          let activeRole: Role = (savedRole && backendRoles.includes(savedRole))
            ? savedRole
            : (backendRoles[0] || backendLocalRole || 'STUDENT');

          // Cập nhật User State
          const current = this.currentUser();
          if (current) {
            this.currentUser.set({
              ...current,
              roles: backendRoles,
              localRole: backendLocalRole,
              activeRole
            });
            console.log(`[AuthService] Đã đồng bộ Role từ Backend: ${activeRole}`);
          }

          if (!hadTokenBefore) {
            const homePath = ROLE_HOME[activeRole] || '/dashboard';
            console.log(`[AuthService] Login OK → ${homePath}`);
            this.router.navigateByUrl(homePath);
          }
        } catch (apiError) {
          console.error('[AuthService] Lỗi đồng bộ Backend:', apiError);
          this.clearLocalState();
          this.router.navigate(['/unauthorized']);
        }
      }
    } catch (err) {
      console.error('[AuthService] OAuth Init Error:', err);
    } finally {
      this._readyResolve();
    }
  }

  private clearLocalState(): void {
    this.currentUser.set(null);
    sessionStorage.removeItem('activeRole');
  }

  login(): void {
    this.oauthService.initCodeFlow();
  }

  logout(): void {
    this.clearLocalState();
    this.oauthService.logOut();
  }

  setActiveRole(role: Role): void {
    const user = this.currentUser();
    if (user && user.roles.includes(role)) {
      this.currentUser.set({ ...user, activeRole: role });
      sessionStorage.setItem('activeRole', role);
      this.router.navigateByUrl(ROLE_HOME[role] || '/dashboard');
    }
  }

  getAccessToken(): string | null {
    return this.oauthService.getAccessToken() ?? null;
  }

  private buildUserFromToken(): void {
    const idClaims = this.oauthService.getIdentityClaims() as any;
    if (!idClaims) return;

    const roles = this.extractRoles();
    this.currentUser.set({
      sub: idClaims.sub,
      name: idClaims.name || idClaims.preferred_username,
      email: idClaims.email,
      roles: roles,
      activeRole: roles[0] || 'STUDENT'
    });
  }

  private extractRoles(): Role[] {
    const token = this.oauthService.getAccessToken();
    if (!token) return [];
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rolesObj = payload[ROLES_CLAIM] || {};
      return Object.keys(rolesObj).map(r => r.toUpperCase() as Role);
    } catch {
      return [];
    }
  }

  static roleLabel(role: Role): string {
    return ROLE_LABELS[role] ?? role;
  }
}
