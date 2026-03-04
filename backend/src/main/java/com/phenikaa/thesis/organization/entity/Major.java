package com.phenikaa.thesis.organization.entity;

import com.phenikaa.thesis.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "majors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Major extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @Column(length = 20, unique = true, nullable = false)
    private String code;

    @Column(length = 200, nullable = false)
    private String name;

    @Column(name = "required_credits", nullable = false)
    private Integer requiredCredits;

    @Column(name = "min_gpa_for_thesis", nullable = false, precision = 3, scale = 2)
    private BigDecimal minGpaForThesis;
}
