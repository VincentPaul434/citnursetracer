package com.alumni.tracer.employment.repository;

import com.alumni.tracer.employment.model.EmploymentData;
import com.alumni.tracer.submission.model.SurveySubmission;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmploymentDataRepository extends JpaRepository<EmploymentData, UUID> {
    Optional<EmploymentData> findBySubmission(SurveySubmission submission);
}
