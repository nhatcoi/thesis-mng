package com.phenikaa.thesis.defense.repository;

import com.phenikaa.thesis.defense.entity.DefenseSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DefenseSessionRepository extends JpaRepository<DefenseSession, UUID> {
    List<DefenseSession> findByCouncilId(UUID councilId);
}
