package com.phenikaa.thesis.organization.repository;

import com.phenikaa.thesis.organization.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, UUID> {
    List<Faculty> findBySchoolId(UUID schoolId);
}
