package com.alumni.tracer.submission.dto;

import java.util.UUID;

public record SurveySubmissionResponse(
    UUID submissionId,
    String message
) {}
