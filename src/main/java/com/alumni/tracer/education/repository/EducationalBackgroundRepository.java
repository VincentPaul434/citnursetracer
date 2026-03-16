package com.alumni.tracer.education.repository;

import com.alumni.tracer.education.model.EducationalBackground;
import com.alumni.tracer.submission.model.SurveySubmission;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationalBackgroundRepository extends JpaRepository<EducationalBackground, UUID> {
    Optional<EducationalBackground> findBySubmission(SurveySubmission submission);
}
