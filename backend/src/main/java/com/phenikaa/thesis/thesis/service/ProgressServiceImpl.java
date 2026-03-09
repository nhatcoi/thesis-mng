package com.phenikaa.thesis.thesis.service;

import com.phenikaa.thesis.audit.annotation.Auditable;
import com.phenikaa.thesis.batch.entity.ThesisBatch;
import com.phenikaa.thesis.batch.entity.enums.BatchStatus;
import com.phenikaa.thesis.common.exception.BusinessException;
import com.phenikaa.thesis.notification.entity.enums.NotificationType;
import com.phenikaa.thesis.notification.service.NotificationService;
import com.phenikaa.thesis.thesis.dto.ProgressUpdateResponse;
import com.phenikaa.thesis.thesis.entity.ProgressUpdate;
import com.phenikaa.thesis.thesis.entity.Thesis;
import com.phenikaa.thesis.thesis.entity.enums.ProgressStatus;
import com.phenikaa.thesis.thesis.entity.enums.ThesisStatus;
import com.phenikaa.thesis.thesis.mapper.ProgressUpdateMapper;
import com.phenikaa.thesis.thesis.repository.ProgressUpdateRepository;
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

@Service
@RequiredArgsConstructor
public class ProgressServiceImpl implements ProgressService {

    private final ProgressUpdateRepository progressRepo;
    private final ThesisRepository thesisRepo;
    private final NotificationService notificationService;
    private final ProgressUpdateMapper progressMapper;

    @Override
    @Transactional
    @Auditable(action = "SUBMIT_PROGRESS", entityType = "ProgressUpdate")
    public ProgressUpdateResponse submitProgress(User user, int weekNumber, String title, String description, MultipartFile file) {
        if (user.getStudent() == null)
            throw new BusinessException("Chỉ sinh viên mới có thể cập nhật tiến độ.");

        Thesis thesis = thesisRepo.findByStudentIdAndBatchStatus(user.getStudent().getId(), BatchStatus.ACTIVE)
                .stream().findFirst()
                .orElseThrow(() -> new BusinessException("Bạn chưa tham gia đợt đồ án nào."));

        // Validate status
        if (thesis.getStatus() != ThesisStatus.OUTLINE_APPROVED && thesis.getStatus() != ThesisStatus.IN_PROGRESS)
            throw new BusinessException("Đề cương chưa được duyệt. Trạng thái: " + thesis.getStatus());

        // Validate implementation period
        ThesisBatch batch = thesis.getBatch();
        OffsetDateTime now = OffsetDateTime.now();
        if (now.isBefore(batch.getImplementationStart()))
            throw new BusinessException("Chưa đến giai đoạn thực hiện. Bắt đầu từ: " + batch.getImplementationStart());
        if (now.isAfter(batch.getImplementationEnd()))
            throw new BusinessException("Đã kết thúc giai đoạn thực hiện.");

        // Save file if provided
        String savedPath = null;
        String fileName = null;
        Long fileSize = null;
        if (file != null && !file.isEmpty()) {
            savedPath = saveFile(file, thesis.getId(), weekNumber);
            fileName = file.getOriginalFilename();
            fileSize = file.getSize();
        }

        ProgressUpdate progress = ProgressUpdate.builder()
                .thesis(thesis)
                .weekNumber(weekNumber)
                .title(title)
                .description(description)
                .filePath(savedPath)
                .fileName(fileName)
                .fileSize(fileSize)
                .status(ProgressStatus.SUBMITTED)
                .submittedAt(now)
                .build();
        progressRepo.save(progress);

        // Update thesis status to IN_PROGRESS
        if (thesis.getStatus() == ThesisStatus.OUTLINE_APPROVED) {
            thesis.setStatus(ThesisStatus.IN_PROGRESS);
            thesisRepo.save(thesis);
        }

        // Notify advisor
        if (thesis.getAdvisor() != null && thesis.getAdvisor().getUser() != null) {
            String studentName = (user.getLastName() + " " + user.getFirstName()).trim();
            notificationService.sendNotification(
                    thesis.getAdvisor().getUser(), NotificationType.PROGRESS_UPDATED,
                    "Cập nhật tiến độ tuần " + weekNumber,
                    "SV " + studentName + " đã cập nhật tiến độ: " + title,
                    "PROGRESS", progress.getId());
        }

        return progressMapper.toResponse(progress);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgressUpdateResponse> getMyProgress(User user) {
        if (user.getStudent() == null) return List.of();
        Thesis thesis = thesisRepo.findByStudentIdAndBatchStatus(user.getStudent().getId(), BatchStatus.ACTIVE)
                .stream().findFirst().orElse(null);
        if (thesis == null) return List.of();
        return progressRepo.findByThesisIdOrderByWeekNumberDescSubmittedAtDesc(thesis.getId())
                .stream().map(progressMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgressUpdateResponse> getAdvisingProgress(User user) {
        if (user.getLecturer() == null) return List.of();
        return progressRepo.findByAdvisorId(user.getLecturer().getId())
                .stream().map(progressMapper::toResponse).toList();
    }

    @Override
    @Transactional
    @Auditable(action = "REVIEW_PROGRESS", entityType = "ProgressUpdate")
    public ProgressUpdateResponse reviewProgress(UUID id, User user, String status, String comment) {
        if (user.getLecturer() == null)
            throw new BusinessException("Chỉ giảng viên mới có thể nhận xét tiến độ.");

        ProgressUpdate progress = progressRepo.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy bản cập nhật tiến độ."));

        Thesis thesis = progress.getThesis();
        if (thesis.getAdvisor() == null || !thesis.getAdvisor().getId().equals(user.getLecturer().getId()))
            throw new BusinessException("Bạn không phải GVHD của sinh viên này.");

        ProgressStatus pStatus = "REVIEWED".equals(status) ? ProgressStatus.REVIEWED : ProgressStatus.NEEDS_REVISION;
        progress.setStatus(pStatus);
        progress.setReviewerComment(comment);
        progress.setReviewedBy(user.getLecturer());
        progress.setReviewedAt(OffsetDateTime.now());
        progressRepo.save(progress);

        // Notify student
        User studentUser = thesis.getStudent().getUser();
        String msg = pStatus == ProgressStatus.REVIEWED
                ? "GVHD đã nhận xét tiến độ tuần " + progress.getWeekNumber() + ": Đạt."
                : "GVHD nhận xét tuần " + progress.getWeekNumber() + " cần bổ sung." +
                  (comment != null && !comment.isBlank() ? " Nhận xét: " + comment : "");

        notificationService.sendNotification(studentUser, NotificationType.PROGRESS_REVIEWED,
                "Nhận xét tiến độ tuần " + progress.getWeekNumber(), msg, "PROGRESS", progress.getId());

        return progressMapper.toResponse(progress);
    }

    // ── File helper ──
    private String saveFile(MultipartFile file, UUID thesisId, int week) {
        try {
            Path baseDir = Paths.get(System.getProperty("user.dir"), "uploads", "progress", thesisId.toString());
            Files.createDirectories(baseDir);
            String fileName = "week" + week + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = baseDir.resolve(fileName);
            file.transferTo(filePath.toFile());
            return filePath.toString();
        } catch (IOException e) {
            throw new BusinessException("Lỗi khi lưu file: " + e.getMessage());
        }
    }
}
