package com.phenikaa.thesis.thesis.controller;

import com.phenikaa.thesis.common.dto.ApiResponse;
import com.phenikaa.thesis.thesis.dto.OutlineResponse;
import com.phenikaa.thesis.thesis.service.OutlineService;
import com.phenikaa.thesis.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/outlines")
@RequiredArgsConstructor
public class OutlineController {

    private final OutlineService outlineService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<OutlineResponse>> submitOutline(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.ok(outlineService.submitOutline(user, file)));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<OutlineResponse>>> getMyOutlines(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(outlineService.getMyOutlines(user)));
    }
}
