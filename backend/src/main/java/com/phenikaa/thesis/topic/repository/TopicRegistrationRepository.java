package com.phenikaa.thesis.topic.repository;

import com.phenikaa.thesis.topic.entity.TopicRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TopicRegistrationRepository extends JpaRepository<TopicRegistration, UUID> {
    List<TopicRegistration> findByThesisId(UUID thesisId);

    List<TopicRegistration> findByTopicId(UUID topicId);

    List<TopicRegistration> findByStudentId(UUID studentId);
}
