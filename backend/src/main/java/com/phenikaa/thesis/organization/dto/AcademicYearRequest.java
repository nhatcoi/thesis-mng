package com.phenikaa.thesis.organization.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record AcademicYearRequest(
        @NotBlank(message = "Tên niên khóa không được để trống") String name,

        @NotNull(message = "Ngày bắt đầu không được để trống") LocalDate startDate,

        @NotNull(message = "Ngày kết thúc không được để trống") LocalDate endDate) {
}
