package com.phenikaa.thesis.defense.repository;

import com.phenikaa.thesis.defense.entity.Council;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CouncilRepository extends JpaRepository<Council, UUID> {
    List<Council> findByBatchId(UUID batchId);
}
