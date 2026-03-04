package com.phenikaa.thesis.defense.entity;

import com.phenikaa.thesis.batch.entity.ThesisBatch;
import com.phenikaa.thesis.common.entity.BaseEntity;
import com.phenikaa.thesis.organization.entity.Major;
import com.phenikaa.thesis.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "councils")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Council extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private ThesisBatch batch;

    @Column(length = 200, nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_id")
    private Major major;

    @Column(name = "max_theses")
    private Integer maxTheses;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
}
