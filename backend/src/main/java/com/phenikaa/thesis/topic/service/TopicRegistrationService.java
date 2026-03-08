package com.phenikaa.thesis.topic.service;

import com.phenikaa.thesis.topic.dto.RegistrationApprovalRequest;
import com.phenikaa.thesis.topic.dto.StudentTopicProposalRequest;
import com.phenikaa.thesis.topic.dto.TopicRegistrationResponse;
import com.phenikaa.thesis.user.entity.User;

import java.util.List;
import java.util.UUID;

public interface TopicRegistrationService {
    List<TopicRegistrationResponse> getMyRegistrations(User user);
    List<TopicRegistrationResponse> getMajorRegistrations(String majorCode);
    List<TopicRegistrationResponse> getStudentRegistrations(User user);
    TopicRegistrationResponse registerTopic(User user, UUID topicId);
    TopicRegistrationResponse proposeTopicByStudent(User user, StudentTopicProposalRequest req);
    TopicRegistrationResponse approveRegistration(UUID registrationId, User user, RegistrationApprovalRequest req);
}
