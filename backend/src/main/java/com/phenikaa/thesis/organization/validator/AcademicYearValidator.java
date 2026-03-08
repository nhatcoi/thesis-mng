package com.phenikaa.thesis.organization.validator;

import com.phenikaa.thesis.common.exception.BusinessException;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class AcademicYearValidator {

    public void validateDates(LocalDate start, LocalDate end) {
        if (start != null && end != null && !start.isBefore(end))
            throw new BusinessException("Ngày bắt đầu phải trước ngày kết thúc niên khóa");
    }
}
