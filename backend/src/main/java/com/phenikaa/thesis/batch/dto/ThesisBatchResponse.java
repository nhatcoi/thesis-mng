package com.phenikaa.thesis.batch.dto;

import com.phenikaa.thesis.batch.entity.enums.BatchStatus;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ThesisBatchResponse(
        UUID id,
        String name,
        UUID academicYearId,
        String academicYearName,
        Integer semester,
        BatchStatus status,
        UUID createdById,
        String createdByName,
        LocalDate topicRegStart,
        LocalDate topicRegEnd,
        LocalDate outlineStart,
        LocalDate outlineEnd,
        LocalDate implementationStart,
        LocalDate implementationEnd,
        LocalDate defenseRegStart,
        LocalDate defenseRegEnd,
        LocalDate defenseStart,
        LocalDate defenseEnd,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}
