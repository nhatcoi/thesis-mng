package com.phenikaa.thesis.thesis.entity;

import com.phenikaa.thesis.thesis.entity.enums.ProgressEvaluation;
import com.phenikaa.thesis.user.entity.Lecturer;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import lombok.*;


import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "progress_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thesis_id", nullable = false)
    private Thesis thesis;

    @Column(name = "week_number")
    private Integer weekNumber;

    @Column(length = 300)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "progress_evaluation")
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private ProgressEvaluation evaluation;

    @Column(name = "reviewer_comment", columnDefinition = "TEXT")
    private String reviewerComment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private Lecturer reviewedBy;

    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;
}
