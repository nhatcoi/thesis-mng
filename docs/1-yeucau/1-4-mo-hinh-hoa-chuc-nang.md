# 1.4 Mô hình hóa chức năng

Mô hình hóa chức năng mô tả các yêu cầu chức năng của hệ thống dưới dạng use case và sơ đồ tương ứng. Các chức năng được nhóm theo ba giai đoạn nghiệp vụ: Đăng ký đề tài & Thực hiện đồ án, Bảo vệ đồ án, Hoàn thiện hồ sơ & Lưu trữ.

---

## 1.4.1 Các yêu cầu chức năng

Phân cấp theo nhóm chức năng để dễ quản lý. Các yêu cầu chức năng được mô tả chi tiết như sau:

**R1. Các yêu cầu về xác thực**
- R1.1 Hệ thống cho phép người dùng đăng nhập qua SSO (Zitadel).
- R1.2 Hệ thống cho phép người dùng đăng xuất khỏi phiên làm việc.

**R2. Các yêu cầu về đăng ký đề tài và thực hiện đồ án**
- R2.1 Hệ thống cho phép Phòng Đào tạo tạo mới đợt đồ án và thiết lập khung thời gian (đăng ký đề tài, nộp đề cương, đăng ký bảo vệ).
- R2.2 Hệ thống cho phép Phòng Đào tạo/Trưởng ngành import danh sách sinh viên và kiểm tra điều kiện làm đồ án (GPA, tín chỉ).
- R2.3 Hệ thống cho phép giảng viên đăng ký đề tài mở (tên, mô tả, số lượng sinh viên tối đa).
- R2.4 Hệ thống cho phép sinh viên chọn đề tài có sẵn hoặc đề xuất đề tài mới (có hoặc không chỉ định giảng viên).
- R2.5 Hệ thống cho phép Trưởng ngành/GVHD duyệt hoặc từ chối đề tài sinh viên đề xuất.
- R2.6 Hệ thống cho phép sinh viên nộp file đề cương đồ án để GVHD duyệt.
- R2.7 Hệ thống cho phép GVHD duyệt hoặc yêu cầu chỉnh sửa đề cương.
- R2.8 Hệ thống cho phép sinh viên cập nhật tiến độ thực hiện đồ án theo từng mốc.
- R2.9 Hệ thống cho phép GVHD xem và đánh giá tiến độ từng sinh viên.
- R2.10 Hệ thống cho phép sinh viên nộp hồ sơ đăng ký bảo vệ (báo cáo, code, slide).
- R2.11 Hệ thống cho phép GVHD duyệt hoặc từ chối đăng ký bảo vệ.

**R3. Các yêu cầu về bảo vệ đồ án**
- R3.1 Hệ thống cho phép PĐT/Trưởng ngành tạo hội đồng bảo vệ và phân công giảng viên (Chủ tịch, Thư ký, Phản biện, Ủy viên).
- R3.2 Hệ thống cho phép PĐT/Thư ký hội đồng tạo phiên bảo vệ và xếp lịch (ngày, giờ, phòng).
- R3.3 Hệ thống cho phép gán đồ án đủ điều kiện (READY_FOR_DEFENSE) vào từng phiên bảo vệ.
- R3.4 Hệ thống cho phép thư ký/PĐT chuẩn bị và xuất hồ sơ phục vụ hội đồng.
- R3.5 Hệ thống cho phép GVHD và hội đồng nhập điểm (advisor_score, council_score) và chốt kết quả (final_score, grade).

**R4. Các yêu cầu về hoàn thiện hồ sơ và lưu trữ**
- R4.1 Hệ thống cho phép sinh viên nộp bản cuối (sau khi hội đồng yêu cầu chỉnh sửa).
- R4.2 Hệ thống cho phép GVHD/Chủ tịch hội đồng duyệt hoặc yêu cầu chỉnh sửa lại bản cuối.
- R4.3 Hệ thống cho phép PĐT chốt kết quả thesis và cập nhật trạng thái hoàn thành.
- R4.4 Hệ thống cho phép PĐT, giảng viên và sinh viên tra cứu, xem và tải hồ sơ đồ án đã lưu trữ.

---

## 1.4.2 Sơ đồ Use-case

Sơ đồ Use-case thể hiện các actor và use case của hệ thống. Chi tiết biểu đồ PlantUML và bảng Actor – Use Case xem tại [use-case-diagram.md](./use-case-diagram.md).

### Nhóm Use-case

| Nhóm | Use Case | Mô tả ngắn |
|------|----------|------------|
| **1. Xác thực** | UC-1.1, UC-1.2 | Đăng nhập, đăng xuất qua SSO |
| **2. Thiết lập đợt & danh sách** | UC-2.1, UC-2.2, UC-2.3 | Quản lý người dùng/SV, khởi tạo đợt đồ án, lập danh sách SV làm đồ án |
| **3. Quản lý đề tài** | UC-3.1, UC-3.2 | GV đăng ký đề tài mở, SV chọn/đề xuất đề tài |
| **4. Đề cương & Tiến độ** | UC-4.1, UC-4.2, UC-4.3, UC-4.4 | SV nộp đề cương, GV duyệt, SV cập nhật tiến độ, GV theo dõi |
| **5. Đăng ký bảo vệ** | UC-5.1, UC-5.2 | SV nộp hồ sơ đăng ký BV, GVHD duyệt |
| **6. Bảo vệ đồ án** | UC-6.1, UC-6.2, UC-6.3, UC-6.4, UC-6.5 | Lập hội đồng, xếp lịch, chuẩn bị hồ sơ, tiến hành BV, chấm điểm |
| **7. Hoàn thiện & lưu trữ** | UC-7.1, UC-7.2, UC-7.3, UC-7.4 | Nộp bản cuối, duyệt bản cuối, chốt kết quả, tra cứu & lưu trữ |

### Sơ đồ Use-case (PlantUML)

```plantuml
@startuml ThesisHub - Use Case Diagram
left to right direction
rectangle "Hệ thống Quản lý Đồ án Tốt nghiệp (ThesisHub)" {
  package "1. Xác thực" {
    usecase (UC-1.1 Đăng nhập) as UC11
    usecase (UC-1.2 Đăng xuất) as UC12
  }
  package "2. Thiết lập đợt & danh sách" {
    usecase (UC-2.1 Quản lý người dùng/SV) as UC21
    usecase (UC-2.2 Khởi tạo đợt) as UC22
    usecase (UC-2.3 Lập DS SV) as UC23
  }
  package "3. Quản lý đề tài" {
    usecase (UC-3.1 GV đăng ký đề tài) as UC31
    usecase (UC-3.2 SV chọn/đề xuất) as UC32
  }
  package "4. Đề cương & Tiến độ" {
    usecase (UC-4.1 SV nộp đề cương) as UC41
    usecase (UC-4.2 GV duyệt đề cương) as UC42
    usecase (UC-4.3 SV cập nhật tiến độ) as UC43
    usecase (UC-4.4 GV theo dõi tiến độ) as UC44
  }
  package "5. Đăng ký bảo vệ" {
    usecase (UC-5.1 SV đăng ký BV) as UC51
    usecase (UC-5.2 GV duyệt ĐKBV) as UC52
  }
  package "6. Bảo vệ đồ án" {
    usecase (UC-6.1 Lập hội đồng) as UC61
    usecase (UC-6.2 Xếp lịch BV) as UC62
    usecase (UC-6.3 Chuẩn bị hồ sơ) as UC63
    usecase (UC-6.4 Tiến hành BV) as UC64
    usecase (UC-6.5 Chấm điểm) as UC65
  }
  package "7. Hoàn thiện & lưu trữ" {
    usecase (UC-7.1 Nộp bản cuối) as UC71
    usecase (UC-7.2 Duyệt bản cuối) as UC72
    usecase (UC-7.3 Chốt kết quả) as UC73
    usecase (UC-7.4 Tra cứu & lưu trữ) as UC74
  }
}

actor "PĐT" as PDT
actor "Trưởng ngành" as HEAD
actor "Giảng viên" as GV
actor "Sinh viên" as SV
actor "Thư ký HĐ" as SEC
actor "Chủ tịch HĐ" as CHAIR
actor "SSO" as SSO

PDT --> UC11 & UC12 & UC21 & UC22 & UC23 & UC61 & UC62 & UC63 & UC73 & UC74
HEAD --> UC11 & UC12 & UC23 & UC32 & UC61
GV --> UC11 & UC12 & UC31 & UC32 & UC42 & UC44 & UC52 & UC64 & UC65 & UC72 & UC74
SV --> UC11 & UC12 & UC32 & UC41 & UC43 & UC51 & UC64 & UC71 & UC74
SEC --> UC62 & UC63
CHAIR --> UC65 & UC72
SSO --> UC11 & UC12
@enduml
```

### Bảng tóm tắt Actor – Use Case

| Actor | Các Use Case |
|-------|--------------|
| Phòng Đào tạo (PĐT) | UC-1.1, UC-1.2, UC-2.1, UC-2.2, UC-2.3, UC-6.1, UC-6.2, UC-6.3, UC-7.3, UC-7.4 |
| Trưởng ngành | UC-1.1, UC-1.2, UC-2.3, UC-3.2, UC-6.1 |
| Giảng viên | UC-1.1, UC-1.2, UC-3.1, UC-3.2, UC-4.2, UC-4.4, UC-5.2, UC-6.4, UC-6.5, UC-7.2, UC-7.4 |
| Sinh viên | UC-1.1, UC-1.2, UC-3.2, UC-4.1, UC-4.3, UC-5.1, UC-6.4, UC-7.1, UC-7.4 |
| Thư ký Hội đồng | UC-6.2, UC-6.3 |
| Chủ tịch Hội đồng | UC-6.5, UC-7.2 |
| Hệ thống SSO (Zitadel) | UC-1.1, UC-1.2 *(hỗ trợ)* |
