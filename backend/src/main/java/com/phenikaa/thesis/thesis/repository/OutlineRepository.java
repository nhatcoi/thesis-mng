package com.phenikaa.thesis.thesis.repository;

import com.phenikaa.thesis.thesis.entity.Outline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface OutlineRepository extends JpaRepository<Outline, UUID> {
    List<Outline> findByThesisIdOrderByVersionDesc(UUID thesisId);
}
