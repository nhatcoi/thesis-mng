package com.phenikaa.thesis.thesis.repository;

import com.phenikaa.thesis.thesis.entity.ProgressReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProgressReportRepository extends JpaRepository<ProgressReport, UUID> {
    List<ProgressReport> findByThesisIdOrderByWeekNumberAsc(UUID thesisId);
}
