## Flow xác thực với Zitadel SSO

### 1. Kiến trúc kết nối

```text
          +-------------------------+
          |      Zitadel SSO       |
          |   (OIDC Provider)      |
          |  http://localhost:18080|
          +-----------+------------+
                      ^
                      |  (OIDC: /authorize, /token,
                      |         /userinfo, /introspect)
                      |
   +------------------+------------------+
   |                                     |
   v                                     v
+---------------------+         +----------------------+
|  Angular SPA        |         |  Spring Boot API     |
|  http://localhost:4200       |  http://localhost:8080|
|  (Auth Code + PKCE) |         |  (Resource Server)   |
+---------------------+         +----------------------+
          |                               ^
          |  HTTP API                     |
          |  Authorization: Bearer token  |
          +-------------------------------+
```

- Angular: đăng nhập với Zitadel, giữ token, gọi API.
- Spring: chỉ nhận Bearer token, kiểm tra với Zitadel, áp quyền.

---

### 2. Login flow (Angular ↔ Zitadel ↔ Angular)

```text
User
 │
 │ 1. Mở /login, bấm "Đăng nhập bằng SSO"
 v
Angular SPA
 ┌───────────────────────────────────────────────────────┐
 │ login() → initCodeFlow()                             │
 │  → redirect browser tới:                             │
 │    http://localhost:18080/oauth/v2/authorize         │
 │      ?client_id=362708277525544962@thesis_management │
 │      &redirect_uri=http://localhost:4200             │
 │      &response_type=code                             │
 │      &code_challenge=...&code_challenge_method=S256  │
 └───────────────────────────────────────────────────────┘
                      │
          2. Trang login Zitadel
                      v
                 Zitadel SSO
          ┌───────────────────────┐
          │ Nhập user/pass        │
          │ Sinh auth code        │
          └─────────+─────────────┘
                    │
                    │ 3. Redirect về SPA
                    v
        http://localhost:4200/?code=XYZ&state=...
                    │
                    │ 4. APP_INITIALIZER → AuthService.init()
                    v
Angular SPA
 ┌───────────────────────────────────────────────────────┐
 │ loadDiscoveryDocumentAndTryLogin()                    │
 │  → POST /oauth/v2/token (đổi code → token)           │
 │  → Nhận access_token + id_token                      │
 │  → Đọc claims (sub, email, roles)                    │
 │  → set currentUser, activeRole                       │
 │  → chuyển router: /dashboard                         │
 └───────────────────────────────────────────────────────┘
```

Kết quả: login xong, user luôn quay về `http://localhost:4200/dashboard` nếu token hợp lệ.

---

### 3. Flow gọi API (Angular ↔ Spring ↔ Zitadel)

```text
Angular SPA
 ┌───────────────────────────────────────────────────────┐
 │ Lấy access_token từ OAuthService                     │
 │ Gọi API:                                             │
 │   GET /api/batches                                   │
 │   Host: http://localhost:8080                        │
 │   Header: Authorization: Bearer <access_token>       │
 └───────────────────────────────────────────────────────┘
                          │
                          v
Spring Boot API (Resource Server)
 ┌───────────────────────────────────────────────────────┐
 │ SecurityFilterChain + BearerTokenAuthenticationFilter │
 │  → lấy token từ header                                │
 │  → chọn cách kiểm tra:                                │
 │      - Nếu token dạng xxx.yyy.zzz (JWT):              │
 │          verify bằng JWKS (issuer-uri)               │
 │      - Nếu token opaque:                              │
 │          POST /oauth/v2/introspect tới Zitadel        │
 │  → map roles claim → ROLE_*                          │
 │  → @PreAuthorize, @EnableMethodSecurity xử lý quyền  │
 └───────────────────────────────────────────────────────┘
                          │
                          v
                    Controllers / Services
```

---

### 4. Mapping role & user local

#### 4.1. Roles từ Zitadel → Spring Security

```text
Claim trong token:

urn:zitadel:iam:org:project:roles = {
  "TRAINING_DEPT": { ... },
  "LECTURER": { ... }
}
```

Spring:

```text
TRAINING_DEPT → ROLE_TRAINING_DEPT
LECTURER      → ROLE_LECTURER
...
```

Sử dụng trong code:

- `hasRole('TRAINING_DEPT')`
- `hasAnyRole('ADMIN','TRAINING_DEPT')`

#### 4.2. Đồng bộ user vào DB local

```text
Zitadel token claims
  - sub
  - email
  - given_name, family_name
  - preferred_username
              │
              v
UserSyncService.syncFromClaims()
  - Tìm user theo external_id / email / username
  - Nếu chưa có → tạo user mới (role mặc định: STUDENT)
  - Nếu có → cập nhật tên, lastLoginAt
```

User local được dùng để:

- Liên kết với bảng sinh viên, giảng viên, đợt đồ án…
- Lưu thêm trạng thái nội bộ không nằm trong Zitadel.

