package com.phenikaa.thesis.grading.repository;

import com.phenikaa.thesis.grading.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface GradeRepository extends JpaRepository<Grade, UUID> {
    List<Grade> findByThesisId(UUID thesisId);
}
