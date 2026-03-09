package com.phenikaa.thesis.thesis.controller;

import com.phenikaa.thesis.common.dto.ApiResponse;
import com.phenikaa.thesis.common.util.SecurityUtils;
import com.phenikaa.thesis.thesis.dto.ProgressUpdateResponse;
import com.phenikaa.thesis.thesis.service.ProgressService;
import com.phenikaa.thesis.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;
    private final SecurityUtils securityUtils;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ProgressUpdateResponse>> submitProgress(
            @RequestParam("weekNumber") int weekNumber,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(progressService.submitProgress(user, weekNumber, title, description, file)));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<ProgressUpdateResponse>>> getMyProgress() {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(progressService.getMyProgress(user)));
    }

    @GetMapping("/advising")
    @PreAuthorize("hasAnyRole('LECTURER', 'DEPT_HEAD')")
    public ResponseEntity<ApiResponse<List<ProgressUpdateResponse>>> getAdvisingProgress() {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(progressService.getAdvisingProgress(user)));
    }

    @PatchMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('LECTURER', 'DEPT_HEAD')")
    public ResponseEntity<ApiResponse<ProgressUpdateResponse>> reviewProgress(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(
                progressService.reviewProgress(id, user, body.get("status"), body.get("comment"))));
    }
}
