import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export type Role = 'ADMIN' | 'TRAINING_DEPT' | 'DEPT_HEAD' | 'LECTURER' | 'STUDENT';

export interface User {
  sub: string;
  name: string;
  email: string;
  roles: Role[];
  activeRole: Role;
}

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Quản trị hệ thống',
  TRAINING_DEPT: 'Phòng Đào tạo',
  DEPT_HEAD: 'Trưởng ngành',
  LECTURER: 'Giảng viên',
  STUDENT: 'Sinh viên',
};

const ROLES_CLAIM = 'urn:zitadel:iam:org:project:roles';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private oauthService = inject(OAuthService);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());

  async init(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const authConfig: AuthConfig = {
      issuer: environment.sso.issuer,
      clientId: environment.sso.clientId,
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin + '/login',
      responseType: 'code',
      scope: environment.sso.scope,
      showDebugInformation: true,
      requireHttps: false,
    };

    this.oauthService.configure(authConfig);

    try {
      const result = await this.oauthService.loadDiscoveryDocumentAndTryLogin();
      console.log('[AuthService] Discovery loaded, tryLogin result:', result);
    } catch (err) {
      console.error('[AuthService] Discovery/login failed:', err);
    }

    if (this.oauthService.hasValidAccessToken()) {
      console.log('[AuthService] Valid access token found');
      this.buildUserFromToken();
    } else {
      console.log('[AuthService] No valid access token');
    }
  }

  login(): void {
    this.oauthService.initCodeFlow();
  }

  logout(): void {
    this.oauthService.logOut();
    this.currentUser.set(null);
  }

  setActiveRole(role: Role): void {
    const user = this.currentUser();
    if (user && user.roles.includes(role)) {
      this.currentUser.set({ ...user, activeRole: role });
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.setItem('activeRole', role);
      }
    }
  }

  getAccessToken(): string | null {
    return this.oauthService.getAccessToken() ?? null;
  }

  private buildUserFromToken(): void {
    const idClaims = this.oauthService.getIdentityClaims() as Record<string, unknown> | null;
    if (!idClaims) return;

    const roles = this.extractRoles();
    const savedRole = isPlatformBrowser(this.platformId)
      ? sessionStorage.getItem('activeRole') as Role | null
      : null;

    const activeRole = (savedRole && roles.includes(savedRole))
      ? savedRole
      : roles[0] ?? 'STUDENT';

    this.currentUser.set({
      sub: (idClaims['sub'] as string) ?? '',
      name: (idClaims['name'] as string) ?? '',
      email: (idClaims['email'] as string) ?? '',
      roles,
      activeRole,
    });
  }

  private extractRoles(): Role[] {
    const accessToken = this.oauthService.getAccessToken();
    if (!accessToken) return [];

    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const rolesObj = payload[ROLES_CLAIM] as Record<string, unknown> | undefined;
      if (!rolesObj) return [];
      return Object.keys(rolesObj)
        .map(r => r.toUpperCase() as Role)
        .filter(r => Object.keys(ROLE_LABELS).includes(r));
    } catch {
      return [];
    }
  }

  static roleLabel(role: Role): string {
    return ROLE_LABELS[role] ?? role;
  }
}
