package com.phenikaa.thesis.grading.repository;

import com.phenikaa.thesis.grading.entity.GradeApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GradeApprovalRepository extends JpaRepository<GradeApproval, UUID> {
    Optional<GradeApproval> findByThesisId(UUID thesisId);
}
