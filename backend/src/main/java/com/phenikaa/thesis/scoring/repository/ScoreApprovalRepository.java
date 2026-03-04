package com.phenikaa.thesis.scoring.repository;

import com.phenikaa.thesis.scoring.entity.ScoreApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScoreApprovalRepository extends JpaRepository<ScoreApproval, UUID> {
    Optional<ScoreApproval> findByThesisId(UUID thesisId);
}
