package com.phenikaa.thesis.thesis.service;

import com.phenikaa.thesis.batch.entity.ThesisBatch;
import com.phenikaa.thesis.batch.entity.enums.BatchStatus;
import com.phenikaa.thesis.common.exception.BusinessException;
import com.phenikaa.thesis.notification.entity.enums.NotificationType;
import com.phenikaa.thesis.notification.service.NotificationService;
import com.phenikaa.thesis.thesis.dto.OutlineResponse;
import com.phenikaa.thesis.thesis.entity.Outline;
import com.phenikaa.thesis.thesis.entity.Thesis;
import com.phenikaa.thesis.thesis.entity.enums.OutlineStatus;
import com.phenikaa.thesis.thesis.entity.enums.ThesisStatus;
import com.phenikaa.thesis.thesis.repository.OutlineRepository;
import com.phenikaa.thesis.thesis.repository.ThesisRepository;
import com.phenikaa.thesis.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OutlineServiceImpl implements OutlineService {

    private final OutlineRepository outlineRepo;
    private final ThesisRepository thesisRepo;
    private final NotificationService notificationService;

    private static final String UPLOAD_DIR = "uploads/outlines";

    @Override
    @Transactional
    public OutlineResponse submitOutline(User user, MultipartFile file) {
        if (user.getStudent() == null)
            throw new BusinessException("Chỉ sinh viên mới có thể nộp đề cương.");

        // Find active thesis
        Thesis thesis = thesisRepo.findByStudentIdAndBatchStatus(
                user.getStudent().getId(), BatchStatus.ACTIVE)
                .stream().findFirst()
                .orElseThrow(() -> new BusinessException("Bạn chưa tham gia đợt đồ án nào đang hoạt động."));

        // Validate thesis status
        if (thesis.getStatus() != ThesisStatus.TOPIC_ASSIGNED 
                && thesis.getStatus() != ThesisStatus.OUTLINE_REJECTED) {
            throw new BusinessException("Bạn cần được phân công đề tài trước khi nộp đề cương. Trạng thái hiện tại: " + thesis.getStatus());
        }

        // Validate outline period
        ThesisBatch batch = thesis.getBatch();
        OffsetDateTime now = OffsetDateTime.now();
        if (now.isBefore(batch.getOutlineStart()))
            throw new BusinessException("Chưa đến thời gian nộp đề cương. Bắt đầu từ: " + batch.getOutlineStart());
        if (now.isAfter(batch.getOutlineEnd()))
            throw new BusinessException("Đã quá hạn nộp đề cương. Hạn cuối: " + batch.getOutlineEnd());

        // Validate file
        if (file == null || file.isEmpty())
            throw new BusinessException("Vui lòng chọn file đề cương để upload.");

        String originalName = file.getOriginalFilename();
        if (originalName == null || !originalName.toLowerCase().endsWith(".pdf"))
            throw new BusinessException("Chỉ chấp nhận file PDF.");

        // Determine version
        List<Outline> existingOutlines = outlineRepo.findByThesisIdOrderByVersionDesc(thesis.getId());
        int nextVersion = existingOutlines.isEmpty() ? 1 : existingOutlines.get(0).getVersion() + 1;

        // Save file
        String savedPath = saveFile(file, thesis.getId(), nextVersion);

        // Create outline record
        Outline outline = Outline.builder()
                .thesis(thesis)
                .version(nextVersion)
                .filePath(savedPath)
                .fileName(originalName)
                .fileSize(file.getSize())
                .status(OutlineStatus.SUBMITTED)
                .submittedAt(now)
                .build();
        outlineRepo.save(outline);

        // Update thesis status
        thesis.setStatus(ThesisStatus.OUTLINE_SUBMITTED);
        thesisRepo.save(thesis);

        // Notify advisor
        if (thesis.getAdvisor() != null && thesis.getAdvisor().getUser() != null) {
            String studentName = fullName(user);
            String topicTitle = thesis.getTopic() != null ? thesis.getTopic().getTitle() : "N/A";
            notificationService.sendNotification(
                    thesis.getAdvisor().getUser(),
                    NotificationType.OUTLINE_REVIEWED,
                    "Sinh viên nộp đề cương",
                    "Sinh viên " + studentName + " (" + user.getStudent().getStudentCode()
                            + ") đã nộp đề cương v" + nextVersion + " cho đề tài \"" + topicTitle + "\".",
                    "OUTLINE", outline.getId());
        }

        return toResponse(outline);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OutlineResponse> getMyOutlines(User user) {
        if (user.getStudent() == null) return List.of();

        Thesis thesis = thesisRepo.findByStudentIdAndBatchStatus(
                user.getStudent().getId(), BatchStatus.ACTIVE)
                .stream().findFirst().orElse(null);
        if (thesis == null) return List.of();

        return outlineRepo.findByThesisIdOrderByVersionDesc(thesis.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Helpers ──

    private String saveFile(MultipartFile file, UUID thesisId, int version) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR, thesisId.toString());
            Files.createDirectories(uploadPath);
            String fileName = "outline_v" + version + "_" + System.currentTimeMillis() + ".pdf";
            Path filePath = uploadPath.resolve(fileName);
            file.transferTo(filePath.toFile());
            return filePath.toString();
        } catch (IOException e) {
            throw new BusinessException("Lỗi khi lưu file đề cương: " + e.getMessage());
        }
    }

    private OutlineResponse toResponse(Outline outline) {
        OutlineResponse res = new OutlineResponse();
        res.setId(outline.getId());
        res.setThesisId(outline.getThesis().getId());
        res.setVersion(outline.getVersion());
        res.setFileName(outline.getFileName());
        res.setFileSize(outline.getFileSize());
        res.setStatus(outline.getStatus());
        res.setReviewerComment(outline.getReviewerComment());
        res.setReviewedAt(outline.getReviewedAt());
        res.setSubmittedAt(outline.getSubmittedAt());
        if (outline.getReviewedBy() != null) {
            res.setReviewerName(fullName(outline.getReviewedBy().getUser()));
        }
        return res;
    }

    private String fullName(User u) {
        return (u.getLastName() + " " + u.getFirstName()).trim();
    }
}
