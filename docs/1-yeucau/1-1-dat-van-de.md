# 1. Yêu cầu (Requirements)

## 1.1. Đặt vấn đề (Problem statement)

**1.1.1. Bối cảnh**

Trong môi trường giáo dục đại học hiện nay, đồ án tốt nghiệp là một phần quan trọng và bắt buộc đối với sinh viên năm cuối. Quy trình quản lý đồ án tốt nghiệp bao gồm nhiều giai đoạn phức tạp từ đăng ký đề tài, phân công giảng viên hướng dẫn, theo dõi tiến độ thực hiện, đến tổ chức bảo vệ và lưu trữ kết quả. Tại nhiều trường đại học, quy trình này vẫn đang được thực hiện thủ công hoặc sử dụng các công cụ rời rạc như Excel, email và giấy tờ văn bản.

Việc quản lý thủ công gây ra nhiều bất cập: khó khăn trong việc theo dõi tiến độ của hàng trăm đồ án cùng lúc, thông tin bị phân tán không đồng nhất giữa các bên liên quan (sinh viên, giảng viên, khoa, phòng đào tạo), mất nhiều thời gian trong các công việc hành chính như đăng ký, phê duyệt và thống kê báo cáo. Đặc biệt, việc lưu trữ và tra cứu thông tin đồ án sau khi hoàn thành thường không hiệu quả, gây khó khăn khi cần tham khảo hoặc kiểm tra đạo văn. Bên cạnh đó, sinh viên gặp khó khăn trong việc đăng ký đề tài, tìm kiếm giảng viên hướng dẫn phù hợp và theo dõi tiến độ. Giảng viên thiếu công cụ để quản lý nhiều sinh viên, giao việc và theo dõi có hệ thống. Các thành viên hội đồng bảo vệ cũng cần thời gian chuẩn bị và đánh giá đồ án được phân công.

**1.1.2. Mục tiêu**

Để giải quyết các vấn đề nêu trên, hệ thống được xây dựng nhằm đạt các mục tiêu định lượng theo chuẩn Planguage. Mục tiêu thứ nhất (BO-1) là rút ngắn thời gian từ lúc đăng ký đến khi hoàn thành phê duyệt đề tài xuống 70% trong vòng một học kỳ sau triển khai. Cụ thể, từ mức 20 ngày hiện tại (theo khảo sát quy trình thủ công năm 2024) xuống còn dưới 6 ngày, với mức kỳ vọng cao là dưới 3 ngày.

Mục tiêu thứ hai (BO-2) là giảm tỷ lệ sai sót trong hồ sơ đăng ký và nhập liệu điểm số xuống dưới 2% ngay trong năm đầu vận hành. Tỷ lệ hiện tại khoảng 15% do sinh viên điền sai mẫu hoặc giảng viên nhập liệu thủ công; mục tiêu kỳ vọng là dưới 0,5%.

Mục tiêu thứ ba (BO-3) là cắt giảm 80% chi phí hành chính và vật tư liên quan đến in ấn, lưu trữ hồ sơ đồ án giấy. Từ mức 100% chi phí cơ sở hiện tại xuống còn 20%, mức kỳ vọng là 5% (chỉ còn in các văn bản pháp lý bắt buộc).

Mục tiêu thứ tư (BO-4) là tăng mức độ hài lòng của sinh viên và giảng viên đối với công tác quản lý đồ án lên 90%. Từ mức 3/5 điểm (60% hài lòng) hiện tại lên trên 4,5/5 điểm, mục tiêu kỳ vọng là 4,8/5 điểm.

**1.1.3. Người dùng mục tiêu**

Hệ thống phục vụ năm nhóm đối tượng người dùng chính. Sinh viên là đối tượng thực hiện đồ án tốt nghiệp, sử dụng hệ thống để đăng ký đề tài, cập nhật tiến độ, nộp báo cáo và xem kết quả đánh giá. Giảng viên hướng dẫn là người trực tiếp hướng dẫn sinh viên, sử dụng hệ thống để đăng ký đề tài mở, theo dõi sinh viên được phân công, đánh giá quá trình và kết quả đồ án. Thành viên hội đồng bao gồm chủ tịch hội đồng, ủy viên phản biện và thư ký, sử dụng hệ thống để xem thông tin đồ án được phân công, chấm điểm và nhập nhận xét. Trưởng ngành/Khoa quản lý và phê duyệt đề tài, phân công giảng viên hướng dẫn, tổ chức hội đồng bảo vệ và theo dõi tổng quan tình hình đồ án của bộ môn. Phòng Đào tạo quản lý toàn bộ quy trình đồ án của trường, thiết lập lịch trình, thống kê báo cáo tổng thể và lưu trữ kết quả.

**1.1.4. Lợi ích khi sử dụng phần mềm**

Đối với sinh viên: dễ dàng tìm kiếm và đăng ký đề tài phù hợp với năng lực và sở thích; theo dõi tiến độ và nhận phản hồi từ giảng viên hướng dẫn kịp thời; nộp báo cáo và tài liệu điện tử thuận tiện, không phụ thuộc giấy tờ; nhận thông báo tự động về lịch bảo vệ và kết quả đánh giá.

Đối với giảng viên hướng dẫn: quản lý tập trung nhiều sinh viên, theo dõi tiến độ từng người có hệ thống; tiết kiệm thời gian trong đăng ký, phê duyệt và báo cáo hành chính; dễ dàng đánh giá và cho điểm sinh viên với tiêu chí rõ ràng; lưu trữ lịch sử hướng dẫn để tham khảo và phát triển đề tài.

Đối với đơn vị quản lý (Khoa/Phòng Đào tạo): giảm thiểu công việc giấy tờ, số hóa toàn bộ quy trình; dễ dàng thống kê, báo cáo theo nhiều tiêu chí (ngành, giảng viên, kỳ); nâng cao tính minh bạch và công bằng trong đánh giá; tối ưu hóa phân công giảng viên và tổ chức hội đồng; xây dựng kho dữ liệu đồ án phục vụ kiểm định chất lượng.

**1.1.5. Phạm vi của dự án**

Dự án tập trung hỗ trợ đầy đủ vòng đời của đồ án tốt nghiệp từ lúc sinh viên đăng ký đề tài đến khi hoàn tất lưu trữ kết quả. Cụ thể, hệ thống cho phép mở và quản lý các đợt đồ án, đăng ký và phê duyệt đề tài, theo dõi tiến độ thực hiện, đăng ký và tổ chức bảo vệ, chấm điểm, hoàn thiện hồ sơ cuối cùng và tra cứu kết quả đồ án.

Các chức năng chính bao gồm: quản lý người dùng và tổ chức (khoa, ngành, năm học), quản lý đề tài và phân công giảng viên hướng dẫn, quản lý tiến độ và hồ sơ nộp của sinh viên, quản lý hội đồng và lịch bảo vệ, ghi nhận điểm và xếp loại, lưu trữ báo cáo/slide/mã nguồn và cung cấp thống kê, báo cáo phục vụ quản lý.

Ngoài ra, hệ thống tích hợp đăng nhập một lần với dịch vụ SSO (Zitadel) và cung cấp thông báo thời gian thực về các sự kiện quan trọng (phê duyệt, lịch bảo vệ, kết quả). Hệ thống chưa bao gồm kiểm tra đạo văn tự động, kết nối API với hệ thống đào tạo hiện hành và các chức năng như chat thời gian thực hay quản lý tài chính liên quan đến đồ án; các phần này được xem là phạm vi mở rộng cho các giai đoạn sau.

## 1.2. Thuật ngữ (Glossary)

**Đồ án tốt nghiệp:** Công trình nghiên cứu hoặc dự án thực hành do sinh viên thực hiện trong năm cuối, là điều kiện bắt buộc để xét tốt nghiệp. Đồ án có GVHD hướng dẫn và được bảo vệ trước hội đồng chấm.

**GVHD (Giảng viên hướng dẫn):** Giảng viên được phân công hướng dẫn sinh viên thực hiện đồ án, duyệt đề cương, theo dõi tiến độ và đánh giá đăng ký bảo vệ.

**Hội đồng bảo vệ:** Tổ chức gồm Chủ tịch, Thư ký, Phản biện và Ủy viên, có nhiệm vụ nghe sinh viên trình bày và chấm điểm đồ án tại buổi bảo vệ.

**Phòng Đào tạo (PĐT):** Đơn vị quản lý cấp trường, chịu trách nhiệm tổ chức đợt đồ án, quản lý danh sách sinh viên và lập hội đồng bảo vệ toàn trường.
