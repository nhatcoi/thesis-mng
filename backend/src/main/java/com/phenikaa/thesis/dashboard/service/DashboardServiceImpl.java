package com.phenikaa.thesis.dashboard.service;

import com.phenikaa.thesis.batch.entity.enums.BatchStatus;
import com.phenikaa.thesis.batch.repository.ThesisBatchRepository;
import com.phenikaa.thesis.dashboard.dto.DashboardStatsResponse;
import com.phenikaa.thesis.topic.entity.enums.TopicStatus;
import com.phenikaa.thesis.topic.repository.TopicRepository;
import com.phenikaa.thesis.user.entity.User;
import com.phenikaa.thesis.user.repository.LecturerRepository;
import com.phenikaa.thesis.user.repository.StudentRepository;
import com.phenikaa.thesis.thesis.repository.ThesisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepo;
    private final LecturerRepository lecturerRepo;
    private final ThesisBatchRepository batchRepo;
    private final TopicRepository topicRepo;
    private final ThesisRepository thesisRepo;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats(User user) {
        boolean isLecturer = user.getRoles().stream().anyMatch(r -> r.getCode().equals("LECTURER"));
        boolean isDeptHead = user.getRoles().stream().anyMatch(r -> r.getCode().equals("DEPT_HEAD"));
        return (isLecturer && !isDeptHead) ? getLecturerStats(user) : getGlobalStats();
    }

    private DashboardStatsResponse getLecturerStats(User user) {
        Map<String, Long> topicsByStatus = new HashMap<>();
        for (TopicStatus s : TopicStatus.values()) topicsByStatus.put(s.name(), topicRepo.countByProposedByIdAndStatus(user.getId(), s));
        long advisingCount = user.getLecturer() != null ? thesisRepo.countByAdvisorId(user.getLecturer().getId()) : 0;
        return DashboardStatsResponse.builder()
                .totalTopics(topicRepo.countByProposedById(user.getId()))
                .totalAdvisingTheses(advisingCount).topicsByStatus(topicsByStatus)
                .build();
    }

    private DashboardStatsResponse getGlobalStats() {
        Map<String, Long> batchesByStatus = new HashMap<>();
        for (BatchStatus s : BatchStatus.values()) batchesByStatus.put(s.name(), batchRepo.countByStatus(s));
        Map<String, Long> topicsByStatus = new HashMap<>();
        for (TopicStatus s : TopicStatus.values()) topicsByStatus.put(s.name(), topicRepo.countByStatus(s));
        return DashboardStatsResponse.builder()
                .totalStudents(studentRepo.count()).totalLecturers(lecturerRepo.count())
                .totalBatches(batchRepo.count()).totalTopics(topicRepo.count())
                .batchesByStatus(batchesByStatus).topicsByStatus(topicsByStatus)
                .eligibleStudents(studentRepo.countByEligibleForThesis(true))
                .ineligibleStudents(studentRepo.countByEligibleForThesis(false))
                .build();
    }
}
