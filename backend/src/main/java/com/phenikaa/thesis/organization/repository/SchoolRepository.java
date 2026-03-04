package com.phenikaa.thesis.organization.repository;

import com.phenikaa.thesis.organization.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface SchoolRepository extends JpaRepository<School, UUID> {
    List<School> findByUniversityId(UUID universityId);
}
