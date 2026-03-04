package com.phenikaa.thesis.organization.entity;

import com.phenikaa.thesis.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "universities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class University extends BaseEntity {

    @Column(length = 20, unique = true, nullable = false)
    private String code;

    @Column(length = 200, nullable = false)
    private String name;
}
