package com.phenikaa.thesis.defense.repository;

import com.phenikaa.thesis.defense.entity.CouncilMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CouncilMemberRepository extends JpaRepository<CouncilMember, UUID> {
    List<CouncilMember> findByCouncilId(UUID councilId);

    List<CouncilMember> findByLecturerId(UUID lecturerId);
}
