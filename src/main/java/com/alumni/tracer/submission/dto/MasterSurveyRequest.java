package com.alumni.tracer.submission.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Map;

/**
 * Single request payload for the entire alumni tracer survey.
 * Matches the frontend's createInitialFormData() in survey-form-page.tsx.
 *
 * The frontend submits one JSON object with all sections at once via POST.
 * Nested records map 1:1 to JPA entities in the backend.
 */
public record MasterSurveyRequest(

    // ── Submission-level ───────────────────────────────────────────
    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    String email,

    @NotBlank(message = "Consent is required")
    String consent,                         // "yes" | "no"

    // ── Section A: Personal Info ───────────────────────────────────
    @NotNull @Valid
    PersonalInfoSection personalInfo,

    // ── Section B: Educational Background ──────────────────────────
    @NotNull @Valid
    EducationalBackgroundSection educationalBackground,

    // ── Section B: Licensure Examination ───────────────────────────
    @NotNull @Valid
    LicensureExaminationSection licensureExamination,

    // ── Section C: Employment Data ─────────────────────────────────
    @NotNull @Valid
    EmploymentSection employment,

    // ── Section D: Program Evaluation ──────────────────────────────
    @NotNull @Valid
    ProgramEvaluationSection programEvaluation,

    // ── Section E: Communication Preferences ───────────────────────
    @NotNull @Valid
    CommunicationPreferenceSection communicationPreference
) {

    // ── Nested section records ─────────────────────────────────────

    public record PersonalInfoSection(
        @NotBlank(message = "Full name is required")
        String fullName,

        String gender,                      // "Male" | "Female" | "Prefer not to say" | "Other"
        String genderOther,

        String civilStatus,                 // "Single" | "Married" | "Widowed" | "Other"
        String civilStatusOther,

        @NotNull(message = "Birthday is required")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate birthday,

        @NotBlank(message = "Residence is required")
        String residence,

        @NotBlank(message = "Contact information is required")
        String contactInformation
    ) {}

    public record EducationalBackgroundSection(
        @NotBlank(message = "Degree program is required")
        String degreeProgramCompleted,

        @NotBlank(message = "Year graduated is required")
        String yearGraduated,               // "2020" | "2021" | ... | "Other"
        String yearGraduatedOther,

        /**
         * Frontend sends: { "cumLaude": true, "magnaCumLaude": false, "none": true, ... }
         * Service layer extracts truthy keys → "cumLaude,none" for DB storage.
         */
        @NotNull(message = "Academic honors selection is required")
        Map<String, Boolean> academicHonors,
        String academicHonorsOtherText,

        @NotBlank(message = "Pursued further studies answer is required")
        String pursuedFurtherStudies,       // "Yes" | "No"
        String furtherDegreeProgram
    ) {}

    public record LicensureExaminationSection(
        @NotBlank(message = "PNLE answer is required")
        String hasTakenPnle,                // "Yes" | "No"

        // Conditional: only when hasTakenPnle == "Yes"
        String licensureStatus,             // "Passed" | "Failed" | "Waiting for results"
        String pnleYearPassed,
        String pnleYearPassedOther,
        String examTakeCount                // "1" | "2" | "3 or more"
    ) {}

    public record EmploymentSection(
        @NotBlank(message = "Employment status is required")
        String employmentStatus,            // "Employed" | "Self employed" | "Unemployed" | "Currently studying"

        // ── When Employed / Self employed ──────────────────────────
        String jobRelatedToDegree,          // "Yes" | "No"
        String employmentSector,            // "Government Hospital" | ... | "Other"
        String employmentSectorOther,
        String positionDesignation,         // "Staff Nurse" | ... | "Other"
        String positionDesignationOther,
        String firstJobDuration,            // "Less than 3 months" | ... | "More than 1 year"
        Map<String, Boolean> firstJobSources,
        String firstJobSourceOtherText,
        String estimatedMonthlySalary,      // Contains ₱ and en-dash — stored as-is

        // ── When Unemployed / Currently studying ───────────────────
        Map<String, Boolean> unemploymentReasons,
        String unemploymentReasonOtherText
    ) {}

    public record ProgramEvaluationSection(
        /**
         * Frontend sends: { "clinicalSkills": true, "criticalThinking": false, ... }
         * Service layer extracts truthy keys → "clinicalSkills,criticalThinking" for DB storage.
         */
        Map<String, Boolean> relevanceSkills,

        @NotBlank(message = "Career preparation level is required")
        String careerPreparationLevel,      // "Very well prepared" | ... | "Not prepared"

        @NotBlank(message = "Nursing program aspect is required")
        String nursingProgramAspect,

        @NotBlank(message = "Nursing program suggestion is required")
        String nursingProgramSuggestion
    ) {}

    public record CommunicationPreferenceSection(
        /**
         * Frontend sends: { "email": true, "messenger": false, ... }
         * Service layer extracts truthy keys → "email,messenger" for DB storage.
         */
        @NotNull(message = "Invitation channels selection is required")
        Map<String, Boolean> invitationChannels,
        String invitationChannelOtherText,

        @NotBlank(message = "Update frequency is required")
        String updateFrequency,

        @NotBlank(message = "Alumni group willingness is required")
        String alumniGroupWillingness,      // "Yes" | "No" | "Maybe"

        String alumniPlatform               // Conditional: required when willingness == "Yes"
    ) {}
}
