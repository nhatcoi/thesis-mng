package com.phenikaa.thesis.topic.entity;

import com.phenikaa.thesis.batch.entity.ThesisBatch;
import com.phenikaa.thesis.common.entity.BaseEntity;
import com.phenikaa.thesis.topic.entity.enums.TopicSource;
import com.phenikaa.thesis.topic.entity.enums.TopicStatus;
import com.phenikaa.thesis.user.entity.User;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import lombok.*;

@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private ThesisBatch batch;

    @Column(length = 500, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "max_students", nullable = false)
    private Integer maxStudents;

    @Column(name = "current_students", nullable = false)
    private Integer currentStudents;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "topic_source")
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private TopicSource source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "topic_status")
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private TopicStatus status;

    @Column(name = "major_code", length = 20)
    private String majorCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposed_by", nullable = false)
    private User proposedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "reject_reason", columnDefinition = "TEXT")
    private String rejectReason;
}
