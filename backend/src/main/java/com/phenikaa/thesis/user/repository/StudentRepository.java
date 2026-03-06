package com.phenikaa.thesis.user.repository;

import com.phenikaa.thesis.user.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID>, JpaSpecificationExecutor<Student> {
        Optional<Student> findByStudentCode(String studentCode);

        Optional<Student> findByUserId(UUID userId);

        List<Student> findByMajorCode(String majorCode);

        List<Student> findByEligibleForThesisTrue();

        long countByEligibleForThesis(boolean eligible);

        long countByMajorCode(String majorCode);

        long countByMajorCodeAndEligibleForThesis(String majorCode, boolean eligible);
}
