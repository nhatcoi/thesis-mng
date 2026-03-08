package com.phenikaa.thesis.thesis.service;

import com.phenikaa.thesis.thesis.dto.OutlineResponse;
import com.phenikaa.thesis.user.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface OutlineService {
    OutlineResponse submitOutline(User user, MultipartFile file);
    List<OutlineResponse> getMyOutlines(User user);
}
