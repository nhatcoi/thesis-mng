package com.phenikaa.thesis.user.controller;

import com.phenikaa.thesis.batch.entity.ThesisBatch;
import com.phenikaa.thesis.batch.entity.enums.BatchStatus;
import com.phenikaa.thesis.common.dto.ApiResponse;
import com.phenikaa.thesis.common.util.SecurityUtils;
import com.phenikaa.thesis.thesis.dto.DefenseRegistrationResponse;
import com.phenikaa.thesis.thesis.dto.OutlineResponse;
import com.phenikaa.thesis.thesis.dto.ProgressUpdateResponse;
import com.phenikaa.thesis.thesis.entity.Thesis;
import com.phenikaa.thesis.thesis.mapper.DefenseRegistrationMapper;
import com.phenikaa.thesis.thesis.mapper.OutlineMapper;
import com.phenikaa.thesis.thesis.mapper.ProgressUpdateMapper;
import com.phenikaa.thesis.thesis.mapper.ThesisMapper;
import com.phenikaa.thesis.thesis.repository.DefenseRegistrationRepository;
import com.phenikaa.thesis.thesis.repository.OutlineRepository;
import com.phenikaa.thesis.thesis.repository.ProgressUpdateRepository;
import com.phenikaa.thesis.thesis.repository.ThesisRepository;
import com.phenikaa.thesis.user.entity.Lecturer;
import com.phenikaa.thesis.user.entity.Student;
import com.phenikaa.thesis.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final SecurityUtils securityUtils;
    private final ThesisRepository thesisRepo;
    private final OutlineRepository outlineRepo;
    private final ProgressUpdateRepository progressRepo;
    private final DefenseRegistrationRepository defenseRepo;
    private final ThesisMapper thesisMapper;
    private final OutlineMapper outlineMapper;
    private final ProgressUpdateMapper progressMapper;
    private final DefenseRegistrationMapper defenseMapper;

    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyProfile() {
        User user = securityUtils.getCurrentUser();
        Map<String, Object> profile = new LinkedHashMap<>();

        // 1) Account info
        Map<String, Object> account = new LinkedHashMap<>();
        account.put("fullName", ((user.getLastName() != null ? user.getLastName() : "") + " " +
                (user.getFirstName() != null ? user.getFirstName() : "")).trim());
        account.put("email", user.getEmail());
        account.put("phone", user.getPhone());
        account.put("username", user.getUsername());
        account.put("status", user.getStatus() != null ? user.getStatus().name() : null);
        account.put("lastLoginAt", user.getLastLoginAt());
        List<String> roleNames = new ArrayList<>();
        for (var role : user.getRoles()) {
            roleNames.add(role.getCode().name());
        }
        account.put("roles", roleNames);
        profile.put("account", account);

        // 2) Role-specific
        Student student = user.getStudent();
        Lecturer lecturer = user.getLecturer();

        if (student != null) {
            Map<String, Object> sv = new LinkedHashMap<>();
            sv.put("studentCode", student.getStudentCode());
            sv.put("majorCode", student.getMajorCode());
            sv.put("cohort", student.getCohort());
            sv.put("className", student.getClassName());
            sv.put("eligibleForThesis", student.getEligibleForThesis());
            profile.put("student", sv);
        }

        if (lecturer != null) {
            Map<String, Object> gv = new LinkedHashMap<>();
            gv.put("lecturerCode", lecturer.getLecturerCode());
            gv.put("facultyName", lecturer.getFaculty() != null ? lecturer.getFaculty().getName() : null);
            gv.put("maxStudentsPerBatch", lecturer.getMaxStudentsPerBatch());
            gv.put("managedMajorCode", lecturer.getManagedMajorCode());
            profile.put("lecturer", gv);
        }

        // 3) Current thesis situation (student only)
        if (student != null) {
            List<Thesis> theses = thesisRepo.findByStudentIdAndBatchStatus(student.getId(), BatchStatus.ACTIVE);
            if (!theses.isEmpty()) {
                Thesis thesis = theses.get(0);
                ThesisBatch batch = thesis.getBatch();
                Map<String, Object> situation = new LinkedHashMap<>();
                situation.put("batchName", batch.getName());
                situation.put("thesisStatus", thesis.getStatus().name());
                situation.put("topicTitle", thesis.getTopic() != null ? thesis.getTopic().getTitle() : null);
                situation.put("advisorName", thesis.getAdvisor() != null ? thesisMapper.fullName(thesis.getAdvisor().getUser()) : null);

                Map<String, Object> timeline = new LinkedHashMap<>();
                timeline.put("topicRegStart", batch.getTopicRegStart());
                timeline.put("topicRegEnd", batch.getTopicRegEnd());
                timeline.put("outlineStart", batch.getOutlineStart());
                timeline.put("outlineEnd", batch.getOutlineEnd());
                timeline.put("implementationStart", batch.getImplementationStart());
                timeline.put("implementationEnd", batch.getImplementationEnd());
                timeline.put("defenseRegStart", batch.getDefenseRegStart());
                timeline.put("defenseRegEnd", batch.getDefenseRegEnd());
                situation.put("timeline", timeline);
                profile.put("currentSituation", situation);

                // 4) History
                UUID thesisId = thesis.getId();

                List<OutlineResponse> outlines = outlineRepo.findByThesisIdOrderByVersionDesc(thesisId)
                        .stream().map(outlineMapper::toResponse).toList();
                profile.put("outlines", outlines);

                List<ProgressUpdateResponse> progresses = progressRepo.findByThesisIdOrderByWeekNumberDescSubmittedAtDesc(thesisId)
                        .stream().map(progressMapper::toResponse).toList();
                profile.put("progresses", progresses);

                List<DefenseRegistrationResponse> defenses = defenseRepo.findByThesisIdOrderBySubmittedAtDesc(thesisId)
                        .stream().map(defenseMapper::toResponse).toList();
                profile.put("defenses", defenses);
            }
        }

        return ResponseEntity.ok(ApiResponse.ok(profile));
    }
}
