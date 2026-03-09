package com.phenikaa.thesis.thesis.dto;

import com.phenikaa.thesis.thesis.entity.enums.ProgressStatus;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class ProgressUpdateResponse {
    private UUID id;
    private UUID thesisId;
    private Integer weekNumber;
    private String title;
    private String description;
    private String fileName;
    private Long fileSize;
    private String publicUrl;
    private ProgressStatus status;
    private String reviewerComment;
    private String reviewerName;
    private OffsetDateTime reviewedAt;
    private OffsetDateTime submittedAt;
    // For lecturer view
    private String studentName;
    private String studentCode;
    private String topicTitle;
}
