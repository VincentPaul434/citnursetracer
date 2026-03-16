package com.alumni.tracer.communication.repository;

import com.alumni.tracer.communication.model.CommunicationPreference;
import com.alumni.tracer.submission.model.SurveySubmission;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunicationPreferenceRepository extends JpaRepository<CommunicationPreference, UUID> {
    Optional<CommunicationPreference> findBySubmission(SurveySubmission submission);
}
