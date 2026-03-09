package com.phenikaa.thesis.thesis.repository;

import com.phenikaa.thesis.thesis.entity.ProgressUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProgressUpdateRepository extends JpaRepository<ProgressUpdate, UUID> {
    List<ProgressUpdate> findByThesisIdOrderByWeekNumberDescSubmittedAtDesc(UUID thesisId);

    @Query("SELECT p FROM ProgressUpdate p JOIN FETCH p.thesis t JOIN FETCH t.student s JOIN FETCH s.user " +
           "WHERE t.advisor.id = :advisorId ORDER BY p.submittedAt DESC")
    List<ProgressUpdate> findByAdvisorId(@Param("advisorId") UUID advisorId);
}
