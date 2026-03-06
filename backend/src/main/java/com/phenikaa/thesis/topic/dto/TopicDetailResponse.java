package com.phenikaa.thesis.topic.dto;

import com.phenikaa.thesis.thesis.entity.enums.ThesisStatus;
import com.phenikaa.thesis.topic.entity.enums.RegistrationStatus;
import com.phenikaa.thesis.topic.entity.enums.TopicSource;
import com.phenikaa.thesis.topic.entity.enums.TopicStatus;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TopicDetailResponse {

    // === Thông tin chính ===
    private UUID id;
    private String title;
    private String description;
    private String requirements;
    private TopicSource source;
    private TopicStatus status;
    private String rejectReason;
    private OffsetDateTime createdAt;

    // === Phạm vi ===
    private String majorCode;
    private String majorName;
    private String facultyName;
    private UUID batchId;
    private String batchName;
    private Integer maxStudents;
    private Integer currentStudents;
    private Integer availableSlots;

    // === Giảng viên hướng dẫn ===
    private UUID lecturerId;
    private String lecturerName;
    private String lecturerCode;
    private String lecturerEmail;
    private String lecturerPhone;
    private String lecturerFacultyName;

    // === Danh sách sinh viên ===
    private List<StudentInfo> registeredStudents;    // SV đã đăng ký (TopicRegistration)
    private List<StudentInfo> assignedStudents;      // SV đã được gán (Thesis.topic = this topic)

    @Data
    @Builder
    public static class StudentInfo {
        private UUID studentId;
        private String studentName;
        private String studentCode;
        private String majorCode;
        private String majorName;
        // For registered students
        private RegistrationStatus registrationStatus;
        private OffsetDateTime registeredAt;
        // For assigned students (thesis)
        private ThesisStatus thesisStatus;
    }
}
