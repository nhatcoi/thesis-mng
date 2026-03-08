package com.phenikaa.thesis.batch.service;

import com.phenikaa.thesis.auth.service.CurrentUserService;
import com.phenikaa.thesis.batch.dto.ThesisBatchCreateRequest;
import com.phenikaa.thesis.batch.dto.ThesisBatchResponse;
import com.phenikaa.thesis.batch.dto.ThesisBatchUpdateRequest;
import com.phenikaa.thesis.batch.entity.ThesisBatch;
import com.phenikaa.thesis.batch.entity.enums.BatchStatus;
import com.phenikaa.thesis.batch.mapper.ThesisBatchMapper;
import com.phenikaa.thesis.batch.repository.ThesisBatchRepository;
import com.phenikaa.thesis.batch.validator.ThesisBatchValidator;
import com.phenikaa.thesis.common.exception.BusinessException;
import com.phenikaa.thesis.common.exception.ResourceNotFoundException;
import com.phenikaa.thesis.organization.entity.AcademicYear;
import com.phenikaa.thesis.organization.repository.AcademicYearRepository;
import com.phenikaa.thesis.user.entity.User;
import com.phenikaa.thesis.user.entity.enums.UserRole;
import com.phenikaa.thesis.user.repository.UserRepository;
import com.phenikaa.thesis.audit.annotation.Auditable;
import com.phenikaa.thesis.notification.entity.enums.NotificationType;
import com.phenikaa.thesis.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ThesisBatchServiceImpl implements ThesisBatchService {

    private final ThesisBatchRepository batchRepo;
    private final AcademicYearRepository academicYearRepo;
    private final UserRepository userRepo;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;
    private final ThesisBatchMapper batchMapper;
    private final ThesisBatchValidator batchValidator;

    @Override
    @Transactional
    @Auditable(action = "CREATE_BATCH", entityType = "ThesisBatch")
    public ThesisBatchResponse createBatch(ThesisBatchCreateRequest req) {
        AcademicYear ay = findAcademicYear(req.academicYearId());
        batchValidator.validateDateRanges(req.topicRegStart(), req.topicRegEnd(),
                req.outlineStart(), req.outlineEnd(),
                req.implementationStart(), req.implementationEnd(),
                req.defenseRegStart(), req.defenseRegEnd(),
                req.defenseStart(), req.defenseEnd());

        User creator = currentUserService.getCurrentUser();
        ThesisBatch batch = ThesisBatch.builder()
                .name(req.name())
                .academicYear(ay)
                .semester(req.semester())
                .status(BatchStatus.DRAFT)
                .createdBy(userRepo.getReferenceById(creator.getId()))
                .topicRegStart(req.topicRegStart()).topicRegEnd(req.topicRegEnd())
                .outlineStart(req.outlineStart()).outlineEnd(req.outlineEnd())
                .implementationStart(req.implementationStart()).implementationEnd(req.implementationEnd())
                .defenseRegStart(req.defenseRegStart()).defenseRegEnd(req.defenseRegEnd())
                .defenseStart(req.defenseStart()).defenseEnd(req.defenseEnd())
                .build();

        return batchMapper.toResponse(batchRepo.save(batch));
    }

    @Override
    @Transactional(readOnly = true)
    public ThesisBatchResponse getBatch(UUID id) {
        return batchMapper.toResponse(findBatch(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ThesisBatchResponse> listBatches(String search, BatchStatus status, Pageable pageable) {
        Specification<ThesisBatch> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null) predicates.add(cb.equal(root.get("status"), status));
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("academicYear").get("name")), pattern)));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return batchRepo.findAll(spec, pageable).map(batchMapper::toResponse);
    }

    @Override
    @Transactional
    @Auditable(action = "UPDATE_BATCH", entityType = "ThesisBatch")
    public ThesisBatchResponse updateBatch(UUID id, ThesisBatchUpdateRequest req) {
        ThesisBatch batch = findBatch(id);
        if (batch.getStatus() != BatchStatus.DRAFT)
            throw new BusinessException("Chỉ được sửa đợt đồ án ở trạng thái DRAFT");

        AcademicYear ay = findAcademicYear(req.academicYearId());
        batchValidator.validateDateRanges(req.topicRegStart(), req.topicRegEnd(),
                req.outlineStart(), req.outlineEnd(),
                req.implementationStart(), req.implementationEnd(),
                req.defenseRegStart(), req.defenseRegEnd(),
                req.defenseStart(), req.defenseEnd());

        batch.setName(req.name()); batch.setAcademicYear(ay); batch.setSemester(req.semester());
        batch.setTopicRegStart(req.topicRegStart()); batch.setTopicRegEnd(req.topicRegEnd());
        batch.setOutlineStart(req.outlineStart()); batch.setOutlineEnd(req.outlineEnd());
        batch.setImplementationStart(req.implementationStart()); batch.setImplementationEnd(req.implementationEnd());
        batch.setDefenseRegStart(req.defenseRegStart()); batch.setDefenseRegEnd(req.defenseRegEnd());
        batch.setDefenseStart(req.defenseStart()); batch.setDefenseEnd(req.defenseEnd());

        return batchMapper.toResponse(batchRepo.save(batch));
    }

    @Override
    @Transactional
    @Auditable(action = "ACTIVATE_BATCH", entityType = "ThesisBatch")
    public ThesisBatchResponse activateBatch(UUID id) {
        ThesisBatch batch = findBatch(id);
        if (batch.getStatus() != BatchStatus.DRAFT)
            throw new BusinessException("Chỉ kích hoạt được đợt ở trạng thái DRAFT (hiện tại: " + batch.getStatus() + ")");

        batch.setStatus(BatchStatus.ACTIVE);
        ThesisBatch saved = batchRepo.save(batch);
        notifyBatchOpened(saved);
        return batchMapper.toResponse(saved);
    }

    @Override
    @Transactional
    @Auditable(action = "CLOSE_BATCH", entityType = "ThesisBatch")
    public ThesisBatchResponse closeBatch(UUID id) {
        ThesisBatch batch = findBatch(id);
        if (batch.getStatus() != BatchStatus.ACTIVE)
            throw new BusinessException("Chỉ đóng được đợt ở trạng thái ACTIVE (hiện tại: " + batch.getStatus() + ")");
        batch.setStatus(BatchStatus.CLOSED);
        return batchMapper.toResponse(batchRepo.save(batch));
    }

    @Override
    @Transactional
    @Auditable(action = "DELETE_BATCH", entityType = "ThesisBatch")
    public void deleteBatch(UUID id) {
        ThesisBatch batch = findBatch(id);
        if (batch.getStatus() != BatchStatus.DRAFT)
            throw new BusinessException("Chỉ được xoá đợt đồ án ở trạng thái DRAFT");
        batchRepo.delete(batch);
    }

    private void notifyBatchOpened(ThesisBatch batch) {
        Set<User> recipients = new HashSet<>();
        recipients.addAll(userRepo.findByRoles_Code(UserRole.LECTURER));
        recipients.addAll(userRepo.findByRoles_Code(UserRole.DEPT_HEAD));
        String title = "Đợt đồ án mới đã mở";
        String message = "Đợt đồ án '" + batch.getName() + "' đã được kích hoạt. Giảng viên có thể bắt đầu tạo đề tài.";
        for (User recipient : recipients) {
            notificationService.sendNotification(recipient, NotificationType.BATCH_OPENED,
                    title, message, "ThesisBatch", batch.getId());
        }
    }

    private ThesisBatch findBatch(UUID id) {
        return batchRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("ThesisBatch", "id", id));
    }

    private AcademicYear findAcademicYear(UUID id) {
        return academicYearRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "id", id));
    }

}
