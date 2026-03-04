package com.phenikaa.thesis.thesis.repository;

import com.phenikaa.thesis.thesis.entity.DefenseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DefenseRegistrationRepository extends JpaRepository<DefenseRegistration, UUID> {
    Optional<DefenseRegistration> findByThesisId(UUID thesisId);
}
