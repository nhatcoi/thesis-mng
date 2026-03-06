package com.phenikaa.thesis.topic.service;

import com.phenikaa.thesis.common.exception.BusinessException;
import com.phenikaa.thesis.common.exception.ResourceNotFoundException;
import com.phenikaa.thesis.thesis.entity.enums.ThesisStatus;
import com.phenikaa.thesis.topic.dto.RegistrationApprovalRequest;
import com.phenikaa.thesis.topic.dto.TopicRegistrationResponse;
import com.phenikaa.thesis.topic.entity.Topic;
import com.phenikaa.thesis.topic.entity.TopicRegistration;
import com.phenikaa.thesis.topic.entity.enums.RegistrationStatus;
import com.phenikaa.thesis.topic.entity.enums.TopicStatus;
import com.phenikaa.thesis.topic.repository.TopicRegistrationRepository;
import com.phenikaa.thesis.topic.repository.TopicRepository;
import com.phenikaa.thesis.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopicRegistrationService {

    private final TopicRegistrationRepository registrationRepo;
    private final TopicRepository topicRepo;
    private final com.phenikaa.thesis.thesis.repository.ThesisRepository thesisRepo;
    private final com.phenikaa.thesis.user.repository.StudentRepository studentRepo;

    @Transactional(readOnly = true)
    public List<TopicRegistrationResponse> getMyRegistrations(User user) {
        return registrationRepo.findByLecturerId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TopicRegistrationResponse> getStudentRegistrations(User user) {
        if (user.getStudent() == null) {
            return new java.util.ArrayList<>();
        }
        return registrationRepo.findByStudentId(user.getStudent().getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TopicRegistrationResponse registerTopic(User user, UUID topicId) {
        if (user.getStudent() == null) {
            throw new BusinessException("Bạn không phải sinh viên");
        }

        com.phenikaa.thesis.user.entity.Student student = user.getStudent();

        Topic topic = topicRepo.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", topicId));

        // Check topic still has slots
        if (topic.getCurrentStudents() >= topic.getMaxStudents()) {
            throw new BusinessException("Đề tài này đã đủ số lượng sinh viên");
        }

        if (topic.getStatus() != com.phenikaa.thesis.topic.entity.enums.TopicStatus.AVAILABLE
                && topic.getStatus() != com.phenikaa.thesis.topic.entity.enums.TopicStatus.APPROVED) {
            throw new BusinessException("Đề tài này không ở trạng thái cho phép đăng ký");
        }

        // Check if student already registered for THIS topic (PENDING)
        java.util.List<TopicRegistration> existing = registrationRepo.findByStudentId(student.getId());
        boolean alreadyRegistered = existing.stream()
                .anyMatch(r -> r.getTopic().getId().equals(topicId) && r.getStatus() == RegistrationStatus.PENDING);
        if (alreadyRegistered) {
            throw new BusinessException("Bạn đã đăng ký đề tài này rồi, vui lòng chờ duyệt");
        }

        // Find the student's thesis record in the same batch
        com.phenikaa.thesis.thesis.entity.Thesis thesis = thesisRepo.findByStudentIdAndBatchId(
                student.getId(), topic.getBatch().getId()).orElse(null);

        if (thesis == null) {
            throw new BusinessException("Bạn chưa được gán vào đợt đồ án này. Vui lòng liên hệ Phòng Đào tạo.");
        }

        TopicRegistration reg = TopicRegistration.builder()
                .thesis(thesis)
                .topic(topic)
                .student(student)
                .status(RegistrationStatus.PENDING)
                .build();

        return mapToResponse(registrationRepo.save(reg));
    }

    @Transactional
    public TopicRegistrationResponse approveRegistration(UUID id, User user, RegistrationApprovalRequest req) {
        TopicRegistration reg = registrationRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TopicRegistration", "id", id));

        // Security check: Only the proposer of the topic can approve/reject
        if (!reg.getTopic().getProposedBy().getId().equals(user.getId())) {
            throw new BusinessException("Bạn không có quyền xử lý yêu cầu này");
        }

        if (reg.getStatus() != RegistrationStatus.PENDING) {
            throw new BusinessException("Yêu cầu này đã được xử lý");
        }

        reg.setStatus(req.getStatus());
        reg.setRejectReason(req.getRejectReason());
        reg.setReviewedBy(user);
        reg.setReviewedAt(OffsetDateTime.now());

        if (req.getStatus() == RegistrationStatus.APPROVED) {
            Topic topic = reg.getTopic();

            if (topic.getCurrentStudents() >= topic.getMaxStudents()) {
                throw new BusinessException("Đề tài này đã đủ số lượng sinh viên");
            }

            // Update topic counts
            topic.setCurrentStudents(topic.getCurrentStudents() + 1);
            if (topic.getCurrentStudents() >= topic.getMaxStudents()) {
                topic.setStatus(TopicStatus.FULL);
            }
            topicRepo.save(topic);

            // Update thesis status
            if (reg.getThesis() != null) {
                reg.getThesis().setTopic(topic);
                reg.getThesis().setAdvisor(topic.getProposedBy().getLecturer()); // Assuming advisor is the one who
                                                                                 // proposed
                reg.getThesis().setStatus(ThesisStatus.IN_PROGRESS);
                thesisRepo.save(reg.getThesis());
            }
        }

        return mapToResponse(registrationRepo.save(reg));
    }

    private TopicRegistrationResponse mapToResponse(TopicRegistration reg) {
        User u = reg.getStudent().getUser();
        String studentName = (u.getLastName() != null ? u.getLastName() : "") + " "
                + (u.getFirstName() != null ? u.getFirstName() : "");

        return TopicRegistrationResponse.builder()
                .id(reg.getId())
                .topicId(reg.getTopic().getId())
                .topicTitle(reg.getTopic().getTitle())
                .studentId(reg.getStudent().getId())
                .studentName(studentName.trim())
                .studentCode(reg.getStudent().getStudentCode())
                .status(reg.getStatus())
                .rejectReason(reg.getRejectReason())
                .createdAt(reg.getCreatedAt())
                .build();
    }
}
