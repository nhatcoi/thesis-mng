# Tổng quan Notification

| # | Type | Đã implement gửi? | Nơi gọi | Người nhận | Nội dung |
|---|------|:-----------------:|---------|------------|----------|
| 1 | `BATCH_OPENED` | ✅ | `ThesisBatchServiceImpl.activateBatch()` | Trưởng ngành, Giảng viên | Đợt đồ án '{tên}' đã được kích hoạt |
| 2 | `TOPIC_REGISTERED` | ✅ | `TopicRegistrationServiceImpl.registerTopic()` | Giảng viên hướng dẫn | SV {tên} ({mã}) đã đăng ký đề tài '{tên}'. Hiện có X/Y SV |
| 3 | `TOPIC_APPROVED` | ❌ | — | — | Chưa gửi |
| 4 | `TOPIC_REJECTED` | ❌ | — | — | Chưa gửi |
| 5 | `ADVISOR_ASSIGNED` | ❌ | — | — | Chưa gửi |
| 6 | `OUTLINE_REVIEWED` | ❌ | — | — | Chưa gửi |
| 7 | `PROGRESS_REMINDER` | ❌ | — | — | Chưa gửi |
| 8 | `DEFENSE_SCHEDULED` | ❌ | — | — | Chưa gửi |
| 9 | `SCORE_PUBLISHED` | ❌ | — | — | Chưa gửi |
| 10 | `GENERAL` | ❌ | — | — | Chưa gửi |

---

## Enum NotificationType

| Type | Mô tả |
|------|-------|
| `BATCH_OPENED` | Đợt đồ án được kích hoạt |
| `TOPIC_REGISTERED` | Sinh viên đăng ký đề tài (FCFS) |
| `TOPIC_APPROVED` | Đăng ký đề tài được duyệt (đề xuất SV) |
| `TOPIC_REJECTED` | Đăng ký đề tài bị từ chối |
| `ADVISOR_ASSIGNED` | GV được gán hướng dẫn sinh viên |
| `OUTLINE_REVIEWED` | Đề cương được duyệt/từ chối |
| `PROGRESS_REMINDER` | Nhắc nhở cập nhật tiến độ |
| `DEFENSE_SCHEDULED` | Đã xếp lịch bảo vệ |
| `SCORE_PUBLISHED` | Điểm đã công bố |
| `GENERAL` | Thông báo chung |

---

## API gửi thông báo

```java
void sendNotification(
    User recipient,
    NotificationType type,
    String title,
    String message,
    String refType,   // "ThesisBatch", "TOPIC", "Thesis", ...
    UUID refId
);
```

---

## Chi tiết từng notification

### 1. BATCH_OPENED ✅

- **Điều kiện:** Admin/Trưởng ngành kích hoạt đợt đồ án (DRAFT → ACTIVE).
- **File:** `ThesisBatchServiceImpl.activateBatch()`
- **Người nhận:** Tất cả Trưởng ngành, tất cả Giảng viên
- **Title:** `Đợt đồ án mới đã mở`
- **Message:** `Đợt đồ án '{tên}' đã được kích hoạt.`
- **refType / refId:** `ThesisBatch`, `batch.getId()`

---

### 2. TOPIC_REGISTERED ✅

- **Điều kiện:** Sinh viên đăng ký đề tài có sẵn (FCFS), gán ngay.
- **File:** `TopicRegistrationServiceImpl.registerTopic()` → `notifyLecturerOnRegister()`
- **Người nhận:** GV sở hữu đề tài (`topic.getProposedBy()`)
- **Title:** `Sinh viên đăng ký đề tài`
- **Message:** `Sinh viên {họ tên} ({mã SV}) đã đăng ký đề tài "{tên đề tài}". Đề tài hiện có X/Y sinh viên.`
- **refType / refId:** `TOPIC`, `topic.getId()`

---

### 3. TOPIC_APPROVED ❌

- **Dự kiến:** Khi GV/Trưởng ngành duyệt đăng ký đề xuất đề tài của SV.
- **Người nhận:** Sinh viên.
- **Gợi ý nơi gọi:** `TopicRegistrationServiceImpl.approveRegistration()` khi `req.getStatus() == APPROVED`.
- **Gợi ý message:** "Đề tài '{tên}' của bạn đã được phê duyệt."

---

### 4. TOPIC_REJECTED ❌

- **Dự kiến:** Khi GV/Trưởng ngành từ chối đăng ký đề xuất đề tài của SV.
- **Người nhận:** Sinh viên.
- **Gợi ý nơi gọi:** `TopicRegistrationServiceImpl.approveRegistration()` khi `req.getStatus() == REJECTED`.
- **Gợi ý message:** "Đề tài '{tên}' của bạn đã bị từ chối. Lý do: {rejectReason}"

---

### 5. ADVISOR_ASSIGNED ❌

- **Dự kiến:** Khi GV được gán hướng dẫn sinh viên (đề xuất SV không chọn GV → TN phân công).
- **Người nhận:** Giảng viên được gán.
- **Gợi ý nơi gọi:** Khi phân công GVHD trong `TopicRegistrationServiceImpl.approveRegistration()` hoặc khi Trưởng ngành gán advisor.

---

### 6. OUTLINE_REVIEWED ❌

- **Dự kiến:** Khi GVHD duyệt hoặc từ chối đề cương.
- **Người nhận:** Sinh viên.
- **Gợi ý message:** "Đề cương đồ án của bạn đã được duyệt." / "Đề cương cần chỉnh sửa: {nhận xét}"

---

### 7. PROGRESS_REMINDER ❌

- **Dự kiến:** Job định kỳ nhắc SV cập nhật tiến độ.
- **Người nhận:** Sinh viên chưa cập nhật đúng hạn.

---

### 8. DEFENSE_SCHEDULED ❌

- **Dự kiến:** Khi xếp lịch bảo vệ cho SV/hội đồng.
- **Người nhận:** SV, thành viên hội đồng.

---

### 9. SCORE_PUBLISHED ❌

- **Dự kiến:** Khi điểm cuối được công bố.
- **Người nhận:** Sinh viên.

---

### 10. GENERAL ❌

- **Dự kiến:** Thông báo tùy biến, không thuộc nhóm trên.

---

## Tóm tắt

| Trạng thái | Số lượng |
|------------|----------|
| Đã implement gửi | **2/10** |
| Chưa implement | **8/10** |

**Đã gửi:**
1. `BATCH_OPENED` — khi kích hoạt đợt đồ án
2. `TOPIC_REGISTERED` — khi SV đăng ký đề tài (FCFS), thông báo cho GV

**Ưu tiên implement tiếp:**
- `TOPIC_APPROVED` / `TOPIC_REJECTED` — thông báo SV khi duyệt/từ chối đề xuất đề tài
- `ADVISOR_ASSIGNED` — thông báo GV khi được gán hướng dẫn
- `OUTLINE_REVIEWED` — thông báo SV khi duyệt đề cương
