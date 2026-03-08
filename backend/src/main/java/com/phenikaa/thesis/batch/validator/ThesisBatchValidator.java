package com.phenikaa.thesis.batch.validator;

import com.phenikaa.thesis.common.exception.BusinessException;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class ThesisBatchValidator {

    public void validateDateRanges(OffsetDateTime topicRegStart, OffsetDateTime topicRegEnd,
            OffsetDateTime outlineStart, OffsetDateTime outlineEnd,
            OffsetDateTime implStart, OffsetDateTime implEnd,
            OffsetDateTime defRegStart, OffsetDateTime defRegEnd,
            OffsetDateTime defStart, OffsetDateTime defEnd) {
        assertBefore(topicRegStart, topicRegEnd, "Thời gian bắt đầu ĐK đề tài phải trước thời gian kết thúc");
        assertBefore(outlineStart, outlineEnd, "Thời gian bắt đầu đề cương phải trước thời gian kết thúc");
        assertBefore(implStart, implEnd, "Thời gian bắt đầu thực hiện phải trước thời gian kết thúc");
        assertBefore(defRegStart, defRegEnd, "Thời gian bắt đầu ĐK bảo vệ phải trước thời gian kết thúc");
        assertBefore(topicRegEnd, outlineStart, "Giai đoạn ĐK đề tài phải kết thúc trước khi bắt đầu đề cương");
        assertBefore(outlineEnd, implStart, "Giai đoạn đề cương phải kết thúc trước khi bắt đầu thực hiện");
        assertBefore(implEnd, defRegStart, "Giai đoạn thực hiện phải kết thúc trước khi bắt đầu ĐK bảo vệ");
        if (defStart != null && defEnd != null) {
            assertBefore(defStart, defEnd, "Thời gian bắt đầu bảo vệ phải trước thời gian kết thúc");
            assertBefore(defRegEnd, defStart, "Giai đoạn ĐK bảo vệ phải kết thúc trước khi bắt đầu bảo vệ");
        }
    }

    private void assertBefore(OffsetDateTime from, OffsetDateTime to, String message) {
        if (from != null && to != null && !from.isBefore(to)) throw new BusinessException(message);
    }
}
