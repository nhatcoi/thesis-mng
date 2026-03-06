package com.phenikaa.thesis.topic.controller;

import com.phenikaa.thesis.common.dto.ApiResponse;
import com.phenikaa.thesis.common.util.SecurityUtils;
import com.phenikaa.thesis.topic.dto.RegistrationApprovalRequest;
import com.phenikaa.thesis.topic.dto.TopicRegistrationResponse;
import com.phenikaa.thesis.topic.service.TopicRegistrationService;
import com.phenikaa.thesis.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/topic-registrations")
@RequiredArgsConstructor
public class TopicRegistrationController {

    private final TopicRegistrationService registrationService;
    private final SecurityUtils securityUtils;

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('LECTURER', 'DEPT_HEAD')")
    public ApiResponse<List<TopicRegistrationResponse>> getMyRegistrations() {
        User user = getCurrentUser();
        return ApiResponse.ok(registrationService.getMyRegistrations(user));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<List<TopicRegistrationResponse>> getMyStudentRegistrations() {
        User user = getCurrentUser();
        return ApiResponse.ok(registrationService.getStudentRegistrations(user));
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<TopicRegistrationResponse> registerTopic(@RequestBody Map<String, String> body) {
        User user = getCurrentUser();
        UUID topicId = UUID.fromString(body.get("topicId"));
        return ApiResponse.ok(registrationService.registerTopic(user, topicId));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('LECTURER', 'DEPT_HEAD')")
    public ApiResponse<TopicRegistrationResponse> approveRegistration(
            @PathVariable UUID id,
            @RequestBody RegistrationApprovalRequest req) {
        User user = getCurrentUser();
        return ApiResponse.ok(registrationService.approveRegistration(id, user, req));
    }

    private User getCurrentUser() {
        User user = securityUtils.getCurrentUser();
        if (user == null) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Bạn cần đăng nhập để thực hiện thao tác này");
        }
        return user;
    }
}
