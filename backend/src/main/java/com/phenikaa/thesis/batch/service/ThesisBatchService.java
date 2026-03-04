package com.phenikaa.thesis.batch.service;

import com.phenikaa.thesis.auth.service.CurrentUserService;
import com.phenikaa.thesis.batch.dto.ThesisBatchCreateRequest;
import com.phenikaa.thesis.batch.dto.ThesisBatchResponse;
import com.phenikaa.thesis.batch.dto.ThesisBatchUpdateRequest;
import com.phenikaa.thesis.batch.entity.ThesisBatch;
import com.phenikaa.thesis.batch.entity.enums.BatchStatus;
import com.phenikaa.thesis.batch.repository.ThesisBatchRepository;
import com.phenikaa.thesis.common.exception.BusinessException;
import com.phenikaa.thesis.common.exception.ResourceNotFoundException;
import com.phenikaa.thesis.organization.entity.AcademicYear;
import com.phenikaa.thesis.organization.repository.AcademicYearRepository;
import com.phenikaa.thesis.user.entity.User;
import com.phenikaa.thesis.user.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ThesisBatchService {

    private final ThesisBatchRepository batchRepo;
    private final AcademicYearRepository academicYearRepo;
    private final UserRepository userRepo;
    private final CurrentUserService currentUserService;

    public ThesisBatchService(ThesisBatchRepository batchRepo,
                              AcademicYearRepository academicYearRepo,
                              UserRepository userRepo,
                              CurrentUserService currentUserService) {
        this.batchRepo = batchRepo;
        this.academicYearRepo = academicYearRepo;
        this.userRepo = userRepo;
        this.currentUserService = currentUserService;
    }

    // ── CREATE ────────────────────────────────────────────────────────────
    @Transactional
    public ThesisBatchResponse createBatch(ThesisBatchCreateRequest req) {
        AcademicYear ay = findAcademicYear(req.academicYearId());
        validateDateRanges(req.topicRegStart(), req.topicRegEnd(),
                req.outlineStart(), req.outlineEnd(),
                req.implementationStart(), req.implementationEnd(),
                req.defenseRegStart(), req.defenseRegEnd(),
                req.defenseStart(), req.defenseEnd());

        User creator = currentUserService.getCurrentUser();
        User managedCreator = userRepo.getReferenceById(creator.getId());

        ThesisBatch batch = ThesisBatch.builder()
                .name(req.name())
                .academicYear(ay)
                .semester(req.semester())
                .status(BatchStatus.DRAFT)
                .createdBy(managedCreator)
                .topicRegStart(req.topicRegStart())
                .topicRegEnd(req.topicRegEnd())
                .outlineStart(req.outlineStart())
                .outlineEnd(req.outlineEnd())
                .implementationStart(req.implementationStart())
                .implementationEnd(req.implementationEnd())
                .defenseRegStart(req.defenseRegStart())
                .defenseRegEnd(req.defenseRegEnd())
                .defenseStart(req.defenseStart())
                .defenseEnd(req.defenseEnd())
                .build();

        return toResponse(batchRepo.save(batch));
    }

    // ── READ (single) ─────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public ThesisBatchResponse getBatch(UUID id) {
        return toResponse(findBatch(id));
    }

    // ── READ (list) ───────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<ThesisBatchResponse> listBatches(BatchStatus status) {
        List<ThesisBatch> batches;
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        if (status != null) {
            batches = batchRepo.findByStatus(status, sort);
        } else {
            batches = batchRepo.findAll(sort);
        }
        return batches.stream().map(this::toResponse).toList();
    }

    // ── UPDATE (only DRAFT batches) ───────────────────────────────────────
    @Transactional
    public ThesisBatchResponse updateBatch(UUID id, ThesisBatchUpdateRequest req) {
        ThesisBatch batch = findBatch(id);

        if (batch.getStatus() != BatchStatus.DRAFT) {
            throw new BusinessException("Chỉ được sửa đợt đồ án ở trạng thái DRAFT");
        }

        AcademicYear ay = findAcademicYear(req.academicYearId());
        validateDateRanges(req.topicRegStart(), req.topicRegEnd(),
                req.outlineStart(), req.outlineEnd(),
                req.implementationStart(), req.implementationEnd(),
                req.defenseRegStart(), req.defenseRegEnd(),
                req.defenseStart(), req.defenseEnd());

        batch.setName(req.name());
        batch.setAcademicYear(ay);
        batch.setSemester(req.semester());
        batch.setTopicRegStart(req.topicRegStart());
        batch.setTopicRegEnd(req.topicRegEnd());
        batch.setOutlineStart(req.outlineStart());
        batch.setOutlineEnd(req.outlineEnd());
        batch.setImplementationStart(req.implementationStart());
        batch.setImplementationEnd(req.implementationEnd());
        batch.setDefenseRegStart(req.defenseRegStart());
        batch.setDefenseRegEnd(req.defenseRegEnd());
        batch.setDefenseStart(req.defenseStart());
        batch.setDefenseEnd(req.defenseEnd());

        return toResponse(batchRepo.save(batch));
    }

    // ── ACTIVATE (DRAFT → ACTIVE) ─────────────────────────────────────────
    @Transactional
    public ThesisBatchResponse activateBatch(UUID id) {
        ThesisBatch batch = findBatch(id);

        if (batch.getStatus() != BatchStatus.DRAFT) {
            throw new BusinessException(
                    "Chỉ kích hoạt được đợt đồ án ở trạng thái DRAFT (hiện tại: " + batch.getStatus() + ")");
        }
        batch.setStatus(BatchStatus.ACTIVE);
        return toResponse(batchRepo.save(batch));
    }

    // ── CLOSE (ACTIVE → CLOSED) ───────────────────────────────────────────
    @Transactional
    public ThesisBatchResponse closeBatch(UUID id) {
        ThesisBatch batch = findBatch(id);

        if (batch.getStatus() != BatchStatus.ACTIVE) {
            throw new BusinessException(
                    "Chỉ đóng được đợt đồ án ở trạng thái ACTIVE (hiện tại: " + batch.getStatus() + ")");
        }
        batch.setStatus(BatchStatus.CLOSED);
        return toResponse(batchRepo.save(batch));
    }

    // ── DELETE (only DRAFT) ───────────────────────────────────────────────
    @Transactional
    public void deleteBatch(UUID id) {
        ThesisBatch batch = findBatch(id);

        if (batch.getStatus() != BatchStatus.DRAFT) {
            throw new BusinessException("Chỉ được xoá đợt đồ án ở trạng thái DRAFT");
        }
        batchRepo.delete(batch);
    }

    // ── helpers ───────────────────────────────────────────────────────────
    private ThesisBatch findBatch(UUID id) {
        return batchRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ThesisBatch", "id", id));
    }

    private AcademicYear findAcademicYear(UUID id) {
        return academicYearRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "id", id));
    }

    private void validateDateRanges(java.time.LocalDate topicRegStart, java.time.LocalDate topicRegEnd,
                                    java.time.LocalDate outlineStart, java.time.LocalDate outlineEnd,
                                    java.time.LocalDate implStart, java.time.LocalDate implEnd,
                                    java.time.LocalDate defRegStart, java.time.LocalDate defRegEnd,
                                    java.time.LocalDate defStart, java.time.LocalDate defEnd) {

        assertBefore(topicRegStart, topicRegEnd, "Ngày bắt đầu ĐK đề tài phải trước ngày kết thúc");
        assertBefore(outlineStart, outlineEnd, "Ngày bắt đầu đề cương phải trước ngày kết thúc");
        assertBefore(implStart, implEnd, "Ngày bắt đầu thực hiện phải trước ngày kết thúc");
        assertBefore(defRegStart, defRegEnd, "Ngày bắt đầu ĐK bảo vệ phải trước ngày kết thúc");

        assertBefore(topicRegEnd, outlineStart, "Giai đoạn ĐK đề tài phải kết thúc trước khi bắt đầu đề cương");
        assertBefore(outlineEnd, implStart, "Giai đoạn đề cương phải kết thúc trước khi bắt đầu thực hiện");
        assertBefore(implEnd, defRegStart, "Giai đoạn thực hiện phải kết thúc trước khi bắt đầu ĐK bảo vệ");

        if (defStart != null && defEnd != null) {
            assertBefore(defStart, defEnd, "Ngày bắt đầu bảo vệ phải trước ngày kết thúc");
            assertBefore(defRegEnd, defStart, "Giai đoạn ĐK bảo vệ phải kết thúc trước khi bắt đầu bảo vệ");
        }
    }

    private void assertBefore(java.time.LocalDate from, java.time.LocalDate to, String message) {
        if (from != null && to != null && !from.isBefore(to)) {
            throw new BusinessException(message);
        }
    }

    private ThesisBatchResponse toResponse(ThesisBatch b) {
        AcademicYear ay = b.getAcademicYear();
        User creator = b.getCreatedBy();
        return new ThesisBatchResponse(
                b.getId(),
                b.getName(),
                ay != null ? ay.getId() : null,
                ay != null ? ay.getName() : null,
                b.getSemester(),
                b.getStatus(),
                creator != null ? creator.getId() : null,
                creator != null ? (creator.getLastName() + " " + creator.getFirstName()) : null,
                b.getTopicRegStart(),
                b.getTopicRegEnd(),
                b.getOutlineStart(),
                b.getOutlineEnd(),
                b.getImplementationStart(),
                b.getImplementationEnd(),
                b.getDefenseRegStart(),
                b.getDefenseRegEnd(),
                b.getDefenseStart(),
                b.getDefenseEnd(),
                b.getCreatedAt(),
                b.getUpdatedAt()
        );
    }
}
