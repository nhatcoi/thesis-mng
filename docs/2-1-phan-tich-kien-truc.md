# 2.1 Phân tích kiến trúc hệ thống

## 2.1.1 Kiến trúc mức cao của hệ thống

ThesisHub được triển khai theo kiến trúc **web client–server nhiều tầng (3-tier)**, gồm tầng trình bày (Client), tầng ứng dụng (Web/Application Server) và tầng dữ liệu (Database Server), đồng thời tích hợp thêm hệ thống xác thực bên ngoài (Zitadel SSO). 

[Chèn Hình 2.1 Sơ đồ kiến trúc client-server tại đây]

Hình 2.1 Sơ đồ kiến trúc client-server

Vai trò của từng thành phần:

**Client:** là thiết bị đầu cuối mà người dùng (Sinh viên, Giảng viên, Cán bộ PĐT, Trưởng ngành) sử dụng để tương tác với hệ thống. Nó có thể là máy tính, điện thoại di động, hoặc bất kỳ thiết bị nào có thể truy cập vào ứng dụng thông qua trình duyệt web. Client đóng vai trò hiển thị giao diện, tiếp nhận thao tác của người dùng và gửi các yêu cầu nghiệp vụ đến hệ thống.

**Web Server:** đóng vai trò như một lớp trung gian giữa Client và Application Server. Nó chịu trách nhiệm tiếp nhận các yêu cầu HTTP từ Client, phân phối tải và truyền tải những yêu cầu này tới Application Server để xử lý. Ngoài ra, Web Server cũng đảm bảo trả về kết quả từ Application Server tới Client (bao gồm cả các tệp tĩnh như HTML, CSS, JS), cho phép người dùng tương tác với hệ thống một cách mượt mà.

**Application Server:** chịu trách nhiệm chính trong việc xử lý các nghiệp vụ và logic phức tạp của hệ thống quản lý đồ án (ví dụ: thuật toán kiểm tra điều kiện sinh viên, phân quyền, tính toán điểm). Nó quản lý các quy trình xử lý chính, điều phối và gửi yêu cầu đến Database Server khi cần truy xuất hoặc cập nhật dữ liệu.

**Database Server:** đóng vai trò là nơi lưu trữ dữ liệu của toàn bộ hệ thống, bao gồm thông tin về người dùng, danh sách đề tài, hồ sơ đồ án, điểm số và nhật ký hệ thống. Nó đảm bảo việc truy xuất và cung cấp dữ liệu chính xác khi có yêu cầu từ Application Server. Mọi thông tin được cập nhật hoặc truy vấn trong hệ thống đều được quản lý bởi Database Server.

**External Identity Provider:** là thành phần cung cấp dịch vụ xác thực tập trung cho hệ thống (Single Sign-On). Nó quản lý tài khoản người dùng và cung cấp thông tin định danh/ủy quyền để Application Server dựa vào đó kiểm tra quyền truy cập cho từng yêu cầu nghiệp vụ.

Mô hình trên giúp hệ thống dễ mở rộng theo số lượng người dùng, đồng thời tách biệt rõ trách nhiệm giữa **tầng hiển thị (client)**, **tầng xử lý (application server)** và **tầng dữ liệu (database)**.

---

## 2.1.2 Các đối tượng trừu tượng chính của hệ thống (Key abstractions)

Các đối tượng trừu tượng chính (key abstractions) là các khái niệm nghiệp vụ cốt lõi được hệ thống quản lý và xử lý xuyên suốt các use case. Danh sách dưới đây là cơ sở để xây dựng mục **2.2 Thực thi trường hợp sử dụng** (sequence diagrams và góc nhìn lớp tham gia).

| STT | Tên đối tượng | Vai trò | Thuộc tính | Phương thức |
|-----|--------------|--------|------------|-------------|
| 1 | **Người dùng** | Đại diện cho các cá nhân tham gia hệ thống (Sinh viên, Giảng viên, Cán bộ PĐT, Trưởng ngành). | Mã người dùng, họ tên, email, số điện thoại, đơn vị, vai trò. | Thêm, sửa, xóa, tìm kiếm, xem chi tiết thông tin cá nhân. |
| 2 | **Đợt đồ án** | Quản lý thông tin cấu hình và các mốc thời gian quy định cho một kỳ làm đồ án tốt nghiệp. | Mã đợt, tên đợt, năm học, học kỳ, các mốc thời gian đăng ký/nộp bài, trạng thái. | Tạo đợt mới, sửa thời gian, xem danh sách, đóng/mở đợt. |
| 3 | **Đề tài** | Quản lý thông tin về các chủ đề nghiên cứu do giảng viên mở hoặc sinh viên tự đề xuất. | Mã đề tài, tên đề tài, mô tả, số lượng sinh viên tối đa, nguồn gốc, trạng thái. | Thêm mới, đề xuất, sửa mô tả, duyệt đề tài, tìm kiếm. |
| 4 | **Đăng ký đề tài** | Ghi nhận việc sinh viên chọn đề tài có sẵn hoặc đề xuất đề tài mới để được gán GVHD. | Mã đăng ký, sinh viên, đề tài, thời gian, trạng thái. | Tạo đăng ký/đề xuất, hủy, duyệt/từ chối, xem lịch sử. |
| 5 | **Đồ án** | Đối tượng trung tâm gắn kết Sinh viên, Giảng viên và Đề tài; quản lý toàn bộ vòng đời thực hiện đồ án. | Mã đồ án, sinh viên, GVHD, đề tài, trạng thái đồ án, kết quả. | Cập nhật trạng thái, nộp hồ sơ, cập nhật tiến độ, chốt kết quả. |
| 6 | **Đề cương** | Hồ sơ mô tả phạm vi/phương pháp/kế hoạch của đồ án để GVHD duyệt trước khi triển khai. | Mã đề cương, đồ án, file, phiên bản, trạng thái. | Nộp, nộp lại, duyệt/từ chối, xem lịch sử phiên bản. |
| 7 | **Tiến độ** | Theo dõi các mốc/cập nhật công việc trong quá trình thực hiện đồ án. | Mã tiến độ, đồ án, nội dung, tệp đính kèm, đánh giá, thời gian. | Thêm cập nhật, chỉnh sửa, nhận xét/đánh giá, xem theo mốc. |
| 8 | **Hồ sơ đăng ký bảo vệ** | Bộ hồ sơ sinh viên nộp để xin bảo vệ (báo cáo, mã nguồn, slide) và kết quả duyệt của GVHD. | Mã hồ sơ, đồ án, các file, trạng thái, thời gian nộp. | Nộp hồ sơ, nộp lại, duyệt/từ chối, xem lịch sử. |
| 9 | **Hội đồng** | Quản lý thông tin tổ chức các ban giám khảo để đánh giá đồ án cuối kỳ. | Mã hội đồng, tên hội đồng, ngành trực thuộc, số đồ án tối đa, trạng thái. | Tạo mới, thêm thành viên (Chủ tịch, Thư ký, Phản biện, Ủy viên), khóa hội đồng. |
| 10 | **Phiên bảo vệ** | Quản lý lịch trình bảo vệ chi tiết về thời gian và địa điểm cho các đồ án. | Mã phiên, ngày giờ bắt đầu, thời lượng dự kiến, phòng bảo vệ. | Tạo phiên mới, xếp đồ án vào phiên, sửa thời gian/phòng. |
| 11 | **Phân công bảo vệ** | Gắn đồ án vào phiên bảo vệ và thiết lập thứ tự trình bày. | Mã phân công, phiên, đồ án, thứ tự. | Gán/hủy gán, đổi thứ tự, kiểm tra xung đột lịch. |
| 12 | **Chấm điểm** | Ghi nhận điểm và nhận xét của GVHD/hội đồng, tính điểm tổng và xếp loại. | Điểm GVHD, điểm hội đồng, điểm tổng, xếp loại, nhận xét. | Nhập điểm, sửa điểm, tính điểm tổng, chốt kết quả. |


