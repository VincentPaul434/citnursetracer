package com.alumni.tracer.personalinfo.repository;

import com.alumni.tracer.personalinfo.model.PersonalInfo;
import com.alumni.tracer.submission.model.SurveySubmission;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, UUID> {
    Optional<PersonalInfo> findBySubmission(SurveySubmission submission);
}
