package com.phenikaa.thesis.thesis.entity;

import com.phenikaa.thesis.thesis.entity.enums.DefenseRegStatus;
import com.phenikaa.thesis.user.entity.Lecturer;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import lombok.*;


import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "defense_registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DefenseRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thesis_id", nullable = false)
    private Thesis thesis;

    @Column(name = "report_file", length = 500, nullable = false)
    private String reportFile;

    @Column(name = "source_code", length = 500)
    private String sourceCode;

    @Column(name = "slide_file", length = 500)
    private String slideFile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "defense_reg_status")
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private DefenseRegStatus status;

    @Column(name = "reject_reason", columnDefinition = "TEXT")
    private String rejectReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private Lecturer reviewedBy;

    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;
}
