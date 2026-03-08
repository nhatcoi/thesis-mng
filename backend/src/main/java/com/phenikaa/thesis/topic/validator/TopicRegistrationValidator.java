package com.phenikaa.thesis.topic.validator;

import com.phenikaa.thesis.batch.entity.ThesisBatch;
import com.phenikaa.thesis.batch.entity.enums.BatchStatus;
import com.phenikaa.thesis.common.exception.BusinessException;
import com.phenikaa.thesis.topic.entity.Topic;
import com.phenikaa.thesis.topic.entity.enums.TopicStatus;
import com.phenikaa.thesis.user.entity.Student;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class TopicRegistrationValidator {

    public void validateBatchRegistrationWindow(ThesisBatch batch) {
        if (batch.getStatus() != BatchStatus.ACTIVE)
            throw new BusinessException("Đợt đồ án \"" + batch.getName() + "\" hiện không hoạt động. Không thể đăng ký.");
        OffsetDateTime now = OffsetDateTime.now();
        if (now.isBefore(batch.getTopicRegStart()))
            throw new BusinessException("Chưa đến thời hạn đăng ký đề tài. Đăng ký mở từ: " + batch.getTopicRegStart() + ".");
        if (now.isAfter(batch.getTopicRegEnd()))
            throw new BusinessException("Đã hết thời hạn đăng ký đề tài. Hạn chót là: " + batch.getTopicRegEnd() + ".");
    }

    public void validateTopicRegistrable(Topic topic, Student student) {
        if (topic.getStatus() != TopicStatus.AVAILABLE && topic.getStatus() != TopicStatus.APPROVED) {
            String reason = switch (topic.getStatus()) {
                case FULL -> "Đề tài đã đủ số lượng sinh viên.";
                case CLOSED -> "Đề tài đã đóng, không nhận đăng ký.";
                case REJECTED -> "Đề tài đã bị từ chối, không thể đăng ký.";
                case PENDING_APPROVAL -> "Đề tài đang chờ duyệt, chưa thể đăng ký.";
                default -> "Đề tài không ở trạng thái cho phép đăng ký.";
            };
            throw new BusinessException(reason);
        }
        if (topic.getCurrentStudents() >= topic.getMaxStudents())
            throw new BusinessException("Đề tài đã đủ " + topic.getMaxStudents() + " sinh viên, không còn chỗ trống.");
        if (topic.getMajorCode() != null && !topic.getMajorCode().isBlank()
                && !topic.getMajorCode().equals(student.getMajorCode()))
            throw new BusinessException("Đề tài này chỉ dành cho ngành " + topic.getMajorCode()
                    + ". Ngành của bạn (" + student.getMajorCode() + ") không phù hợp.");
    }
}
