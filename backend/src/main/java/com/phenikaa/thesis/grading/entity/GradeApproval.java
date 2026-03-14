package com.phenikaa.thesis.grading.entity;

import com.phenikaa.thesis.thesis.entity.Thesis;
import com.phenikaa.thesis.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "grade_approvals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thesis_id", unique = true, nullable = false)
    private Thesis thesis;

    @Column(name = "final_score", nullable = false, precision = 4, scale = 2)
    private BigDecimal finalScore;

    @Column(length = 20, nullable = false)
    private String grade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by", nullable = false)
    private User approvedBy;

    @Column(name = "approved_at")
    private OffsetDateTime approvedAt;
}
