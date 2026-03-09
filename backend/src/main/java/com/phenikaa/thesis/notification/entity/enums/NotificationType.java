package com.phenikaa.thesis.notification.entity.enums;

public enum NotificationType {
    BATCH_OPENED,
    TOPIC_APPROVED,
    TOPIC_REJECTED,
    TOPIC_REGISTERED,      // SV đăng ký đề tài thành công (FCFS)
    TOPIC_PROPOSED,        // SV đề xuất đề tài mới
    ADVISOR_ASSIGNED,
    OUTLINE_REVIEWED,
    PROGRESS_UPDATED,      // SV cập nhật tiến độ → GVHD
    PROGRESS_REVIEWED,     // GV nhận xét tiến độ → SV
    PROGRESS_REMINDER,
    DEFENSE_SCHEDULED,
    SCORE_PUBLISHED,
    GENERAL
}
