package com.phenikaa.thesis.scoring.repository;

import com.phenikaa.thesis.scoring.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ScoreRepository extends JpaRepository<Score, UUID> {
    List<Score> findByThesisId(UUID thesisId);
}
