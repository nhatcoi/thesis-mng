package com.phenikaa.thesis.thesis.validator;

import com.phenikaa.thesis.batch.entity.ThesisBatch;
import com.phenikaa.thesis.common.exception.BusinessException;
import com.phenikaa.thesis.thesis.entity.Thesis;
import com.phenikaa.thesis.thesis.entity.enums.ThesisStatus;
import com.phenikaa.thesis.user.entity.User;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;

@Component
public class OutlineValidator {

    public void validateStudent(User user) {
        if (user.getStudent() == null)
            throw new BusinessException("Chỉ sinh viên mới có thể nộp đề cương.");
    }

    public void validateThesisStatus(Thesis thesis) {
        if (thesis.getStatus() != ThesisStatus.TOPIC_ASSIGNED
                && thesis.getStatus() != ThesisStatus.OUTLINE_REJECTED) {
            throw new BusinessException(
                    "Bạn cần được phân công đề tài trước khi nộp đề cương. Trạng thái hiện tại: " + thesis.getStatus());
        }
    }

    public void validateOutlinePeriod(ThesisBatch batch) {
        OffsetDateTime now = OffsetDateTime.now();
        if (now.isBefore(batch.getOutlineStart()))
            throw new BusinessException("Chưa đến thời gian nộp đề cương. Bắt đầu từ: " + batch.getOutlineStart());
        if (now.isAfter(batch.getOutlineEnd()))
            throw new BusinessException("Đã quá hạn nộp đề cương. Hạn cuối: " + batch.getOutlineEnd());
    }

    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty())
            throw new BusinessException("Vui lòng chọn file đề cương để upload.");

        String originalName = file.getOriginalFilename();
        if (originalName == null || !originalName.toLowerCase().endsWith(".pdf"))
            throw new BusinessException("Chỉ chấp nhận file PDF.");
    }
}
