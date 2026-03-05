package com.phenikaa.thesis.organization.repository;

import com.phenikaa.thesis.organization.entity.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MajorRepository extends JpaRepository<Major, UUID> {
    List<Major> findByFacultyId(UUID facultyId);

    java.util.Optional<Major> findByCode(String code);
}
