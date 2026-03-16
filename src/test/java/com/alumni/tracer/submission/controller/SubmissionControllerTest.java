package com.alumni.tracer.submission.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.alumni.tracer.submission.dto.SurveySubmissionResponse;
import com.alumni.tracer.submission.service.SurveyService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class SubmissionControllerTest {

    @Mock
    private SurveyService surveyService;

    @InjectMocks
    private SubmissionController submissionController;

    @Test
    void submitSurveyReturns201WithSubmissionId() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(submissionController).build();

        UUID submissionId = UUID.randomUUID();
        SurveySubmissionResponse response = new SurveySubmissionResponse(submissionId, "Survey submitted successfully.");
        when(surveyService.submitSurvey(org.mockito.ArgumentMatchers.any())).thenReturn(response);

        String json = """
            {
              "email": "nurse@example.com",
              "consent": "yes",
              "personalInfo": {
                "fullName": "Jane Doe",
                "gender": "Female",
                "genderOther": "",
                "civilStatus": "Single",
                "civilStatusOther": "",
                "birthday": "1998-05-15",
                "residence": "Cebu City",
                "contactInformation": "09171234567"
              },
              "educationalBackground": {
                "degreeProgramCompleted": "Bachelor of Science in Nursing",
                "yearGraduated": "2020",
                "yearGraduatedOther": "",
                "academicHonors": { "cumLaude": true, "none": false },
                "academicHonorsOtherText": "",
                "pursuedFurtherStudies": "No",
                "furtherDegreeProgram": ""
              },
              "licensureExamination": {
                "hasTakenPnle": "Yes",
                "licensureStatus": "Passed",
                "pnleYearPassed": "2020",
                "pnleYearPassedOther": "",
                "examTakeCount": "1"
              },
              "employment": {
                "employmentStatus": "Employed",
                "jobRelatedToDegree": "Yes",
                "employmentSector": "Government Hospital",
                "employmentSectorOther": "",
                "positionDesignation": "Staff Nurse",
                "positionDesignationOther": "",
                "firstJobDuration": "3-6 months",
                "firstJobSources": { "onlineJobPortal": true },
                "firstJobSourceOtherText": "",
                "estimatedMonthlySalary": "₱20,001–₱30,000",
                "unemploymentReasons": {},
                "unemploymentReasonOtherText": ""
              },
              "programEvaluation": {
                "relevanceSkills": { "clinicalSkills": true, "teamwork": true },
                "careerPreparationLevel": "Well prepared",
                "nursingProgramAspect": "Clinical internship",
                "nursingProgramSuggestion": "More lab hours"
              },
              "communicationPreference": {
                "invitationChannels": { "email": true, "messenger": true },
                "invitationChannelOtherText": "",
                "updateFrequency": "Occasionally (major events only)",
                "alumniGroupWillingness": "Yes",
                "alumniPlatform": "Facebook Community"
              }
            }
            """;

        mockMvc.perform(post("/api/v1/submissions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.submissionId").value(submissionId.toString()))
            .andExpect(jsonPath("$.message").value("Survey submitted successfully."));
    }
}
