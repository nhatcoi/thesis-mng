package com.phenikaa.thesis.batch.entity;

import com.phenikaa.thesis.batch.entity.enums.BatchStatus;
import com.phenikaa.thesis.common.entity.BaseEntity;
import com.phenikaa.thesis.organization.entity.AcademicYear;
import com.phenikaa.thesis.user.entity.User;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import lombok.*;


import java.time.LocalDate;

@Entity
@Table(name = "thesis_batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThesisBatch extends BaseEntity {

    @Column(length = 200, nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    @Column(nullable = false)
    private Integer semester;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "batch_status")
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private BatchStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "topic_reg_start", nullable = false)
    private LocalDate topicRegStart;

    @Column(name = "topic_reg_end", nullable = false)
    private LocalDate topicRegEnd;

    @Column(name = "outline_start", nullable = false)
    private LocalDate outlineStart;

    @Column(name = "outline_end", nullable = false)
    private LocalDate outlineEnd;

    @Column(name = "implementation_start", nullable = false)
    private LocalDate implementationStart;

    @Column(name = "implementation_end", nullable = false)
    private LocalDate implementationEnd;

    @Column(name = "defense_reg_start", nullable = false)
    private LocalDate defenseRegStart;

    @Column(name = "defense_reg_end", nullable = false)
    private LocalDate defenseRegEnd;

    @Column(name = "defense_start")
    private LocalDate defenseStart;

    @Column(name = "defense_end")
    private LocalDate defenseEnd;
}
