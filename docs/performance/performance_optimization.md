# Tài liệu Tối ưu hóa Hiệu năng (Performance Optimization)

Tài liệu này tóm tắt các cơ chế tối ưu hóa đã được triển khai để giảm thời gian phản hồi API từ ~1s xuống < 50ms.

## 1. Tối ưu hóa Xác thực (Security Introspection)
Đây là điểm nghẽn lớn nhất do mỗi request phải gọi sang Zitadel Server để kiểm tra Token.

- **Cơ chế triển khai**: 
    - **Introspection Caching**: Sử dụng `CachedIntrospector` kết hợp với Caffeine Cache để lưu kết quả định danh Token trong RAM.
    - **Thời gian sống (TTL)**: 60 phút.
- **Kết quả**: Sau request đầu tiên, các request sau lấy thông tin từ RAM thay vì gọi qua mạng, giảm độ trễ từ ~800ms xuống ~1ms.

## 2. Tối ưu hóa tầng Giao tiếp (Network Interface)
Giảm thiểu overhead khi Backend phải giao tiếp với các dịch vụ bên thứ ba hoặc hạ tầng.

- **Cơ chế triển khai**: 
    - **HTTP Connection Pooling**: Sử dụng `Apache HttpClient 5` để duy trì các kết nối mở sẵn tới Zitadel. Loại bỏ thời gian bắt tay TCP/TLS (Handshake) cho mỗi lần kiểm tra token.
    - **Localhost Optimization**: Chuyển đổi cấu hình từ `localhost` sang `127.0.0.1` cho các kết nối Database để tránh độ trễ phân giải DNS trên hệ điều hành MacOS.
- **Kết quả**: Giảm ~200ms - 500ms độ trễ "lãng phí" ở tầng Network.

## 3. Tối ưu hóa tầng Dịch vụ & Dữ liệu (Service & Data)
Hạn chế các thao tác dư thừa vào Database cho những thông tin ít thay đổi.

- **Cơ chế triển khai**: 
    - **User Sync Caching**: Caching kết quả của `UserSyncService.syncFromClaims` dựa trên định danh người dùng (`sub`).
    - **Master Data Caching**: Áp dụng cơ chế Cache-Aside (Spring Cache) cho các dữ liệu danh mục.

### Danh sách các đối tượng được Cache:

| Tên Cache | Vị trí triển khai (Service/Class) | Đối tượng lưu trữ | Khóa (Key) | Mục đích |
| --- | --- | --- | --- | --- |
| `introspections` | `SecurityConfig` (CachedIntrospector) | `OAuth2AuthenticatedPrincipal` | Access Token | Bỏ qua việc gọi Zitadel API để xác thực token |
| `users` | `UserSyncService` | `User` Entity | `sub` claim (Zitadel ID) | Tránh truy vấn và cập nhật DB User cho mỗi request |
| `majors` | `MajorService` | `Major` Entity | Major Code | Tối ưu hiển thị tên Bộ môn từ mã code |
| `batches` | `BatchService` | `ThesisBatch` Entity | Batch ID (UUID) | Tăng tốc truy xuất thông tin đợt đồ án đang hoạt động |

- **Công nghệ**: `spring-boot-starter-cache` kết hợp với thư viện `Caffeine`.

## 4. Tổng kết chỉ số hiệu năng
| API | Trước tối ưu | Sau tối ưu | Ghi chú |
| --- | --- | --- | --- |
| `/api/auth/check` | ~1.2s | **~11ms** | Cải thiện ~100 lần |
| Các API nghiệp vụ | ~1.0s | **~50-150ms** | Tùy vào độ phức tạp logic |

---
*Cập nhật lần cuối: 10/03/2026*
