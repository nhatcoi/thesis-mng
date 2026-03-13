# 1.2. Thuật ngữ và Từ viết tắt

## Danh mục thuật ngữ sử dụng

| STT | Thuật ngữ | Giải thích |
|-----|-----------|------------|
| 1 | Đồ án tốt nghiệp | Công trình nghiên cứu hoặc dự án thực hành do sinh viên thực hiện năm cuối, điều kiện bắt buộc để xét tốt nghiệp, có GVHD hướng dẫn và bảo vệ trước hội đồng |
| 2 | Hội đồng bảo vệ | Tổ chức gồm Chủ tịch, Thư ký, Phản biện và Ủy viên; có nhiệm vụ nghe sinh viên trình bày và chấm điểm đồ án |
| 3 | Phòng Đào tạo | Đơn vị quản lý cấp trường, tổ chức đợt đồ án, quản lý danh sách sinh viên và lập hội đồng bảo vệ |
| 4 | Trưởng ngành | Giảng viên quản lý ngành, duyệt danh sách sinh viên làm đồ án, phân công GVHD, lập hội đồng bảo vệ |
| 5 | Đợt đồ án | Chu kỳ đồ án (học kỳ, năm, khóa) gắn với khung thời gian đăng ký đề tài, nộp đề cương và đăng ký bảo vệ |
| 6 | Đề cương | Bản mô tả phạm vi, phương pháp và kế hoạch thực hiện đồ án do sinh viên nộp để GVHD duyệt trước khi triển khai |
| 7 | Phiên bảo vệ | Buổi bảo vệ cụ thể (ngày, giờ, phòng) do một hội đồng thực hiện |
| 8 | Trạng thái đồ án | Chuỗi trạng thái từ đủ điều kiện → gán đề tài → duyệt đề cương → thực hiện → đăng ký bảo vệ → bảo vệ → chấm điểm → hoàn thành |

## Danh mục từ viết tắt

| STT | Từ viết tắt | Ý nghĩa |
|-----|-------------|---------|
| 1 | GVHD | Giảng viên hướng dẫn |
| 2 | PĐT | Phòng Đào tạo |
| 3 | SV | Sinh viên |
| 4 | SSO | Single Sign-On (Đăng nhập một lần) |
| 5 | OIDC | OpenID Connect (Giao thức xác thực) |
| 6 | JWT | JSON Web Token |
| 7 | API | Application Programming Interface |
| 8 | REST | Representational State Transfer |
| 9 | OAuth2 | Open Authorization 2.0 |

---

# 1.3. Thông số kỹ thuật bổ sung

**1.3.1. Hiệu năng**
- **Thời gian phản hồi:** Hệ thống phải phản hồi các tác vụ thường dùng (tìm kiếm đề tài, xem danh sách đồ án, truy vấn dữ liệu) trong vòng 2 giây.
- **Xử lý khối lượng dữ liệu:** Hệ thống cần quản lý và xử lý dữ liệu từ hàng trăm đề tài, đồ án và người dùng (sinh viên, giảng viên) đồng thời trong mỗi đợt.
- **Khả năng mở rộng:** Hệ thống hỗ trợ mở rộng linh hoạt khi số lượng người dùng và dữ liệu tăng mà không ảnh hưởng đến hiệu suất.

**1.3.2. Tốc độ**
- **Tốc độ truy xuất cơ sở dữ liệu:** Hệ thống phải truy xuất dữ liệu nhanh, thời gian tải trang dữ liệu (danh sách đề tài, đồ án, người dùng) không quá 3 giây.
- **Tốc độ xử lý giao dịch:** Các thao tác như đăng ký đề tài, nộp đề cương, duyệt đăng ký bảo vệ, nhập điểm phải được xử lý trong vòng 5 giây.

**1.3.3. Độ tin cậy**
- **Tỷ lệ thời gian hoạt động:** Cam kết tỷ lệ sẵn sàng phục vụ (Uptime) đạt tối thiểu 99,5% trong suốt quá trình vận hành.
- **Khả năng phục hồi sau sự cố:** Hệ thống có khả năng tự phục hồi khi gặp sự cố và tránh mất mát dữ liệu quan trọng.
- **Sao lưu dữ liệu:** Dữ liệu phải được sao lưu định kỳ hàng ngày để phòng tránh mất mát do sự cố phần cứng hoặc hệ thống.

**1.3.4. Tính an toàn và bảo mật**
- **Xác thực và phân quyền:** Áp dụng cơ chế xác thực qua SSO (Zitadel) và kiểm soát truy cập dựa trên vai trò (RBAC), đảm bảo chỉ người dùng được phép mới truy cập các chức năng tương ứng. Sinh viên chỉ truy xuất và cập nhật hồ sơ đồ án của bản thân.
- **Mã hóa dữ liệu:** Dữ liệu nhạy cảm (thông tin người dùng, phiên đăng nhập) được mã hóa khi lưu trữ và truyền tải.
- **Chống tấn công:** Hệ thống được bảo vệ trước các lỗ hổng phổ biến như SQL Injection, Cross-Site Scripting (XSS) và Cross-Site Request Forgery (CSRF).

**1.3.5. Khả năng bảo trì**
- **Dễ nâng cấp:** Hệ thống cho phép nâng cấp phần mềm và hạ tầng mà không gây gián đoạn đáng kể đến hoạt động nghiệp vụ.
- **Tính mô-đun:** Kiến trúc được thiết kế theo module/component để dễ dàng thay thế hoặc nâng cấp từng thành phần mà không ảnh hưởng toàn hệ thống.

**1.3.6. Khả năng sử dụng**
- **Giao diện thân thiện:** Giao diện hệ thống phải dễ sử dụng, trực quan cho nhóm người dùng không chuyên về kỹ thuật, rút ngắn thời gian làm quen. Ngôn ngữ hiển thị mặc định là Tiếng Việt.
- **Responsive Design:** Giao diện tương thích hiển thị trên đa nền tảng (Desktop, Tablet, Smartphone).

**1.3.7. Khả năng mở rộng**
- **Tăng trưởng số lượng người dùng:** Hệ thống phải đáp ứng nhu cầu tăng dần số lượng người dùng (sinh viên, giảng viên, cán bộ) mà không ảnh hưởng hiệu suất.
- **Mở rộng kho lưu trữ:** Hệ thống có khả năng mở rộng dung lượng lưu trữ khi số lượng đồ án, tệp báo cáo và tài liệu tăng lên. Hỗ trợ tệp báo cáo đồ án dung lượng tối đa 50MB/tệp.

**1.3.8. Tính khả dụng**
- **Hoạt động 24/7:** Hệ thống đảm bảo hoạt động liên tục phục vụ truy cập của sinh viên và giảng viên trong thời gian đăng ký, nộp báo cáo và xem kết quả.
- **Cơ chế phục hồi sau sự cố:** Xây dựng phương án phục hồi dữ liệu (Disaster Recovery) để khôi phục dịch vụ nhanh chóng sau khi xảy ra sự cố.

**1.3.9. Công nghệ sử dụng**
- **Backend:** Spring Boot 3.5, Java 21, Spring Data JPA, Spring Security (OAuth2/OIDC). API REST, WebSocket (STOMP) cho thông báo thời gian thực. Cơ sở dữ liệu PostgreSQL. Swagger/OpenAPI cho tài liệu API.
- **Frontend:** Angular 21, Angular Material, Tailwind CSS. Ứng dụng SPA với định tuyến theo vai trò. Tích hợp angular-oauth2-oidc để đăng nhập qua Zitadel.
- **Triển khai:** Container hóa bằng Docker, Nginx phục vụ frontend và reverse proxy. Triển khai được trên VPS với docker-compose.

Các thông số kỹ thuật trên đảm bảo hệ thống không chỉ hoạt động hiệu quả mà còn duy trì độ ổn định, bảo mật và khả năng sử dụng trong dài hạn.
