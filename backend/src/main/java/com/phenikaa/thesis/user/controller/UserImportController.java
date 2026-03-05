package com.phenikaa.thesis.user.controller;

import com.phenikaa.thesis.common.dto.ApiResponse;
import com.phenikaa.thesis.user.dto.importing.ImportResult;
import com.phenikaa.thesis.user.service.importing.UserImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/import")
@RequiredArgsConstructor
public class UserImportController {

    private final UserImportService importService;

    @PostMapping("/students")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINING_DEPT')")
    public ResponseEntity<ApiResponse<ImportResult>> importStudents(@RequestParam("file") MultipartFile file) {
        ImportResult result = importService.importStudents(file);
        return ResponseEntity.ok(ApiResponse.ok("Import sinh viên hoàn tất", result));
    }

    @PostMapping("/lecturers")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINING_DEPT')")
    public ResponseEntity<ApiResponse<ImportResult>> importLecturers(@RequestParam("file") MultipartFile file) {
        ImportResult result = importService.importLecturers(file);
        return ResponseEntity.ok(ApiResponse.ok("Import giảng viên hoàn tất", result));
    }
}
