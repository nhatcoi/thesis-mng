package com.phenikaa.thesis.organization.controller;

import com.phenikaa.thesis.common.dto.ApiResponse;
import com.phenikaa.thesis.organization.dto.AcademicYearRequest;
import com.phenikaa.thesis.organization.entity.AcademicYear;
import com.phenikaa.thesis.organization.service.AcademicYearService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/academic-years")
public class AcademicYearController {

    private final AcademicYearService service;

    public AcademicYearController(AcademicYearService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<AcademicYear>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAll()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<AcademicYear>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','TRAINING_DEPT')")
    public ResponseEntity<ApiResponse<AcademicYear>> create(@Valid @RequestBody AcademicYearRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Tạo niên khóa thành công", service.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TRAINING_DEPT')")
    public ResponseEntity<ApiResponse<AcademicYear>> update(
            @PathVariable UUID id,
            @Valid @RequestBody AcademicYearRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật niên khóa thành công", service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TRAINING_DEPT')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa niên khóa thành công", null));
    }
}
