package com.alumni.tracer.evaluation.repository;

import com.alumni.tracer.evaluation.model.ProgramEvaluation;
import com.alumni.tracer.submission.model.SurveySubmission;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramEvaluationRepository extends JpaRepository<ProgramEvaluation, UUID> {
    Optional<ProgramEvaluation> findBySubmission(SurveySubmission submission);
}
