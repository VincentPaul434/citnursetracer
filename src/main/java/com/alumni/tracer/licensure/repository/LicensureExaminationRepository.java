package com.alumni.tracer.licensure.repository;

import com.alumni.tracer.licensure.model.LicensureExamination;
import com.alumni.tracer.submission.model.SurveySubmission;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LicensureExaminationRepository extends JpaRepository<LicensureExamination, UUID> {
    Optional<LicensureExamination> findBySubmission(SurveySubmission submission);
}
