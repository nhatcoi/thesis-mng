package com.phenikaa.thesis.thesis.repository;

import com.phenikaa.thesis.thesis.entity.Thesis;
import com.phenikaa.thesis.thesis.entity.enums.ThesisStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ThesisRepository extends JpaRepository<Thesis, UUID> {
    List<Thesis> findByBatchId(UUID batchId);

    List<Thesis> findByStudentId(UUID studentId);

    List<Thesis> findByAdvisorId(UUID advisorId);

    List<Thesis> findByBatchIdAndStatus(UUID batchId, ThesisStatus status);

    Optional<Thesis> findByStudentIdAndBatchId(UUID studentId, UUID batchId);
}
