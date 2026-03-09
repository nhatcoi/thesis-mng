package com.phenikaa.thesis.thesis.service;

import com.phenikaa.thesis.thesis.dto.ProgressUpdateResponse;
import com.phenikaa.thesis.user.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ProgressService {
    ProgressUpdateResponse submitProgress(User user, int weekNumber, String title, String description, MultipartFile file);
    List<ProgressUpdateResponse> getMyProgress(User user);
    List<ProgressUpdateResponse> getAdvisingProgress(User user);
    ProgressUpdateResponse reviewProgress(UUID id, User user, String status, String comment);
}
