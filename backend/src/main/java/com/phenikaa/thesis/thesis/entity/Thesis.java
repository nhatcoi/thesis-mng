package com.phenikaa.thesis.thesis.entity;

import com.phenikaa.thesis.batch.entity.ThesisBatch;
import com.phenikaa.thesis.common.entity.BaseEntity;
import com.phenikaa.thesis.thesis.entity.enums.ThesisStatus;
import com.phenikaa.thesis.topic.entity.Topic;
import com.phenikaa.thesis.user.entity.Lecturer;
import com.phenikaa.thesis.user.entity.Student;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import lombok.*;


import java.math.BigDecimal;

@Entity
@Table(name = "theses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Thesis extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private ThesisBatch batch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "advisor_id")
    private Lecturer advisor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "thesis_status")
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private ThesisStatus status;

    @Column(name = "advisor_score", precision = 4, scale = 2)
    private BigDecimal advisorScore;

    @Column(name = "council_score", precision = 4, scale = 2)
    private BigDecimal councilScore;

    @Column(name = "final_score", precision = 4, scale = 2)
    private BigDecimal finalScore;

    @Column(length = 20)
    private String grade;

    @Column(name = "advisor_comment", columnDefinition = "TEXT")
    private String advisorComment;
}
