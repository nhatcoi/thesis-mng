package com.phenikaa.thesis.grading.entity;

import com.phenikaa.thesis.grading.entity.enums.GradeType;
import com.phenikaa.thesis.thesis.entity.Thesis;
import com.phenikaa.thesis.user.entity.Lecturer;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "grades", uniqueConstraints = @UniqueConstraint(columnNames = { "thesis_id", "scorer_id", "grade_type" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thesis_id", nullable = false)
    private Thesis thesis;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scorer_id", nullable = false)
    private Lecturer scorer;

    @Enumerated(EnumType.STRING)
    @Column(name = "grade_type", nullable = false, columnDefinition = "grade_type")
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private GradeType gradeType;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal score;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "scored_at")
    private OffsetDateTime gradedAt;
}
