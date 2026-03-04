package com.phenikaa.thesis.batch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record ThesisBatchUpdateRequest(

        @NotBlank
        String name,

        @NotNull
        UUID academicYearId,

        @NotNull
        Integer semester,

        @NotNull
        LocalDate topicRegStart,

        @NotNull
        LocalDate topicRegEnd,

        @NotNull
        LocalDate outlineStart,

        @NotNull
        LocalDate outlineEnd,

        @NotNull
        LocalDate implementationStart,

        @NotNull
        LocalDate implementationEnd,

        @NotNull
        LocalDate defenseRegStart,

        @NotNull
        LocalDate defenseRegEnd,

        LocalDate defenseStart,

        LocalDate defenseEnd
) {
}
