package com.phenikaa.thesis.scoring.entity;

import com.phenikaa.thesis.scoring.entity.enums.ScoreType;
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
@Table(name = "scores", uniqueConstraints = @UniqueConstraint(columnNames = { "thesis_id", "scorer_id", "score_type" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Score {

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
    @Column(name = "score_type", nullable = false, columnDefinition = "score_type")
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private ScoreType scoreType;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal score;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "scored_at")
    private OffsetDateTime scoredAt;
}
