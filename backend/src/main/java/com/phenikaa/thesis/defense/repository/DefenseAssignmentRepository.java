package com.phenikaa.thesis.defense.repository;

import com.phenikaa.thesis.defense.entity.DefenseAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DefenseAssignmentRepository extends JpaRepository<DefenseAssignment, UUID> {
    List<DefenseAssignment> findBySessionId(UUID sessionId);
}
