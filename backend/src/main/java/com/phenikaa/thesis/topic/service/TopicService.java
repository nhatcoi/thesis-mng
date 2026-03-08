package com.phenikaa.thesis.topic.service;

import com.phenikaa.thesis.topic.dto.TopicDetailResponse;
import com.phenikaa.thesis.topic.dto.TopicRequest;
import com.phenikaa.thesis.topic.dto.TopicResponse;
import com.phenikaa.thesis.topic.entity.enums.TopicStatus;
import com.phenikaa.thesis.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface TopicService {
    Page<TopicResponse> getMyTopics(User user, UUID batchId, TopicStatus status, String majorCode, String search, Pageable pageable);
    List<TopicResponse> getAvailableTopics(User user, UUID batchId, String search);
    TopicResponse getTopicById(UUID id);
    TopicDetailResponse getTopicDetail(UUID id);
    TopicResponse createTopic(User user, TopicRequest req);
    TopicResponse updateTopic(UUID id, User user, TopicRequest req);
    void deleteTopic(UUID id, User user);
    TopicResponse closeTopic(UUID id, User user);
    TopicResponse reopenTopic(UUID id, User user);
}
