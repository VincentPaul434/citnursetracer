"use client"

import type React from "react"

import { useState } from "react"
import SurveyShell from "@/components/survey-shell"
import SurveySectionConsent from "@/components/survey-section-consent"
import SurveySectionEducationalBackground from "@/components/survey-section-educational-background"
import SurveySectionEmploymentInformation from "@/components/survey-section-employment-information"
import SurveySectionEmploymentStatus from "@/components/survey-section-employment-status"
import SurveySectionIntro from "@/components/survey-section-intro"
import SurveySectionLicensureExamination from "@/components/survey-section-licensure-examination"
import SurveySectionPersonalInfo from "@/components/survey-section-personal-info"
import SurveySectionPreferredCommunicationEvents from "@/components/survey-section-preferred-communication-events"
import SurveySectionProgramEvaluation from "@/components/survey-section-program-evaluation"
import SurveySectionRelevanceOfEducation from "@/components/survey-section-relevance-of-education"
import SurveySectionUnemploymentInformation from "@/components/survey-section-unemployment-information"
import { Button } from "@/components/ui/button"

interface SurveyFormPageProps {
  onSurveyComplete?: () => void
}

const createInitialFormData = () => ({
  email: "",
  consent: "",
  fullName: "",
  gender: "",
  genderOther: "",
  civilStatus: "",
  civilStatusOther: "",
  birthday: "",
  residence: "",
  contactInformation: "",
  degreeProgramCompleted: "",
  yearGraduated: "",
  yearGraduatedOther: "",
  academicHonors: {
    cumLaude: false,
    magnaCumLaude: false,
    summaCumLaude: false,
    none: false,
    other: false,
  },
  academicHonorsOtherText: "",
  pursuedFurtherStudies: "",
  furtherDegreeProgram: "",
  hasTakenPnle: "",
  licensureStatus: "",
  pnleYearPassed: "",
  pnleYearPassedOther: "",
  examTakeCount: "",
  employmentStatus: "",
  jobRelatedToDegree: "",
  employmentSector: "",
  employmentSectorOther: "",
  positionDesignation: "",
  positionDesignationOther: "",
  firstJobDuration: "",
  firstJobSources: {
    jobFairs: false,
    schoolPlacementOffice: false,
    onlineJobPortal: false,
    recommendationFromFriendsRelatives: false,
    walkInApplication: false,
    other: false,
  },
  firstJobSourceOtherText: "",
  estimatedMonthlySalary: "",
  unemploymentReasons: {
    currentlyPursuingFurtherStudies: false,
    lackOfWorkOpportunities: false,
    familyResponsibility: false,
    healthReasons: false,
    waitingForLicensureExam: false,
    other: false,
  },
  unemploymentReasonOtherText: "",
  relevanceSkills: {
    clinicalSkills: false,
    criticalThinking: false,
    communicationSkills: false,
    leadership: false,
    patientCare: false,
    teamwork: false,
    problemSolving: false,
  },
  careerPreparationLevel: "",
  nursingProgramAspect: "",
  nursingProgramSuggestion: "",
  invitationChannels: {
    email: false,
    facebookPageGroup: false,
    messenger: false,
    smsTextMessage: false,
    officialSchoolWebsite: false,
    phoneCall: false,
    other: false,
  },
  invitationChannelOtherText: "",
  updateFrequency: "",
  alumniGroupWillingness: "",
  alumniPlatform: "",
})

export default function SurveyFormPage({ onSurveyComplete }: SurveyFormPageProps) {
  const [formData, setFormData] = useState(createInitialFormData)
  const [currentSection, setCurrentSection] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11>(1)
  const [consentDeclined, setConsentDeclined] = useState(false)
  const [honorsError, setHonorsError] = useState("")
  const [firstJobSourceError, setFirstJobSourceError] = useState("")
  const [unemploymentReasonError, setUnemploymentReasonError] = useState("")
  const [invitationChannelError, setInvitationChannelError] = useState("")
  const [alumniPlatformError, setAlumniPlatformError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      email: e.target.value,
    }))
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleContinueToConsent = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.email) {
      setCurrentSection(2)
    }
  }

  const handleConsentChange = (value: "yes" | "no") => {
    setFormData((prev) => ({
      ...prev,
      consent: value,
    }))
    setConsentDeclined(false)
  }

  const handleConsentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.consent) return

    if (formData.consent === "yes") {
      setCurrentSection(3)
      return
    }

    setConsentDeclined(true)
  }

  const handleDegreeProgramChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      degreeProgramCompleted: value,
    }))
  }

  const handleYearGraduatedChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      yearGraduated: value,
      yearGraduatedOther: value === "Other" ? prev.yearGraduatedOther : "",
    }))
  }

  const handleAcademicHonorChange = (
    field: "cumLaude" | "magnaCumLaude" | "summaCumLaude" | "none" | "other",
    checked: boolean,
  ) => {
    setFormData((prev) => {
      const updatedHonors = {
        ...prev.academicHonors,
        [field]: checked,
      }

      if (field === "none" && checked) {
        updatedHonors.cumLaude = false
        updatedHonors.magnaCumLaude = false
        updatedHonors.summaCumLaude = false
        updatedHonors.other = false
      }

      if (field !== "none" && checked) {
        updatedHonors.none = false
      }

      return {
        ...prev,
        academicHonors: updatedHonors,
        academicHonorsOtherText: field === "other" && !checked ? "" : prev.academicHonorsOtherText,
      }
    })
    setHonorsError("")
  }

  const handleFurtherStudiesChange = (value: "Yes" | "No") => {
    setFormData((prev) => ({
      ...prev,
      pursuedFurtherStudies: value,
      furtherDegreeProgram: value === "Yes" ? prev.furtherDegreeProgram : "",
    }))
  }

  const handleHasTakenPnleChange = (value: "Yes" | "No") => {
    setFormData((prev) => ({
      ...prev,
      hasTakenPnle: value,
      licensureStatus: value === "Yes" ? prev.licensureStatus : "",
      pnleYearPassed: value === "Yes" ? prev.pnleYearPassed : "",
      pnleYearPassedOther: value === "Yes" ? prev.pnleYearPassedOther : "",
      examTakeCount: value === "Yes" ? prev.examTakeCount : "",
    }))
  }

  const handleLicensureStatusChange = (value: "Passed" | "Failed" | "Waiting for results") => {
    setFormData((prev) => ({
      ...prev,
      licensureStatus: value,
    }))
  }

  const handlePnleYearPassedChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      pnleYearPassed: value,
      pnleYearPassedOther: value === "Other" ? prev.pnleYearPassedOther : "",
    }))
  }

  const handleExamTakeCountChange = (value: "1" | "2" | "3 or more") => {
    setFormData((prev) => ({
      ...prev,
      examTakeCount: value,
    }))
  }

  const handleEmploymentStatusChange = (value: "Employed" | "Self employed" | "Unemployed" | "Currently studying") => {
    setFormData((prev) => ({
      ...prev,
      employmentStatus: value,
    }))
  }

  const handleJobRelatedToDegreeChange = (value: "Yes" | "No") => {
    setFormData((prev) => ({
      ...prev,
      jobRelatedToDegree: value,
    }))
  }

  const handleEmploymentSectorChange = (
    value: "Government Hospital" | "Private Hospital" | "Clinic" | "Community Health Center" | "Non-healthcare related" | "Abroad" | "Other",
  ) => {
    setFormData((prev) => ({
      ...prev,
      employmentSector: value,
      employmentSectorOther: value === "Other" ? prev.employmentSectorOther : "",
    }))
  }

  const handlePositionDesignationChange = (
    value: "Staff Nurse" | "Nurse Trainee" | "Private Duty Nurse" | "Nursing Assistant" | "Other",
  ) => {
    setFormData((prev) => ({
      ...prev,
      positionDesignation: value,
      positionDesignationOther: value === "Other" ? prev.positionDesignationOther : "",
    }))
  }

  const handleFirstJobDurationChange = (value: "Less than 3 months" | "3-6 months" | "6-12 months" | "More than 1 year") => {
    setFormData((prev) => ({
      ...prev,
      firstJobDuration: value,
    }))
  }

  const handleFirstJobSourceChange = (
    field: "jobFairs" | "schoolPlacementOffice" | "onlineJobPortal" | "recommendationFromFriendsRelatives" | "walkInApplication" | "other",
    checked: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      firstJobSources: {
        ...prev.firstJobSources,
        [field]: checked,
      },
      firstJobSourceOtherText: field === "other" && !checked ? "" : prev.firstJobSourceOtherText,
    }))
    setFirstJobSourceError("")
  }

  const handleUnemploymentReasonChange = (
    field:
      | "currentlyPursuingFurtherStudies"
      | "lackOfWorkOpportunities"
      | "familyResponsibility"
      | "healthReasons"
      | "waitingForLicensureExam"
      | "other",
    checked: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      unemploymentReasons: {
        ...prev.unemploymentReasons,
        [field]: checked,
      },
      unemploymentReasonOtherText: field === "other" && !checked ? "" : prev.unemploymentReasonOtherText,
    }))
    setUnemploymentReasonError("")
  }

  const handleRelevanceSkillChange = (
    field:
      | "clinicalSkills"
      | "criticalThinking"
      | "communicationSkills"
      | "leadership"
      | "patientCare"
      | "teamwork"
      | "problemSolving",
    checked: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      relevanceSkills: {
        ...prev.relevanceSkills,
        [field]: checked,
      },
    }))
  }

  const handleCareerPreparationLevelChange = (
    value: "Very well prepared" | "Well prepared" | "Moderately prepared" | "Slightly prepared" | "Not prepared",
  ) => {
    setFormData((prev) => ({
      ...prev,
      careerPreparationLevel: value,
    }))
  }

  const handleProgramEvaluationTextChange = (field: "nursingProgramAspect" | "nursingProgramSuggestion", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleInvitationChannelChange = (
    field: "email" | "facebookPageGroup" | "messenger" | "smsTextMessage" | "officialSchoolWebsite" | "phoneCall" | "other",
    checked: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      invitationChannels: {
        ...prev.invitationChannels,
        [field]: checked,
      },
      invitationChannelOtherText: field === "other" && !checked ? "" : prev.invitationChannelOtherText,
    }))
    setInvitationChannelError("")
  }

  const handleUpdateFrequencyChange = (
    value: "Very often (every event announcement)" | "Occasionally (major events only)" | "Rarely" | "I prefer not to receive updates",
  ) => {
    setFormData((prev) => ({
      ...prev,
      updateFrequency: value,
    }))
  }

  const handleAlumniGroupWillingnessChange = (value: "Yes" | "No" | "Maybe") => {
    setFormData((prev) => ({
      ...prev,
      alumniGroupWillingness: value,
      alumniPlatform: value === "Yes" ? prev.alumniPlatform : "",
    }))
    setAlumniPlatformError("")
  }

  const handleAlumniPlatformChange = (
    value: "Facebook Community" | "Viber Group" | "Whats App" | "Email Newsletter" | "School Website Portal",
  ) => {
    setFormData((prev) => ({
      ...prev,
      alumniPlatform: value,
    }))
    setAlumniPlatformError("")
  }

  const handleEstimatedMonthlySalaryChange = (
    value: "Below ₱10,000" | "₱10,000–₱20,000" | "₱20,001–₱30,000" | "₱30,001–₱40,000" | "₱40,001 and above",
  ) => {
    setFormData((prev) => ({
      ...prev,
      estimatedMonthlySalary: value,
    }))
  }

  const handleGenderChange = (value: "Male" | "Female" | "Prefer not to say" | "Other") => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
      genderOther: value === "Other" ? prev.genderOther : "",
    }))
  }

  const handleCivilStatusChange = (value: "Single" | "Married" | "Widowed" | "Other") => {
    setFormData((prev) => ({
      ...prev,
      civilStatus: value,
      civilStatusOther: value === "Other" ? prev.civilStatusOther : "",
    }))
  }

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setCurrentSection(4)
  }

  const handleEducationalSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedHonorCount = Object.values(formData.academicHonors).filter(Boolean).length
    if (selectedHonorCount === 0) {
      setHonorsError("Please select at least one option for academic honor.")
      return
    }

    setCurrentSection(5)
  }

  const handleLicensureSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setCurrentSection(6)
  }

  const handleEmploymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.employmentStatus === "Unemployed" || formData.employmentStatus === "Currently studying") {
      setCurrentSection(8)
      return
    }

    setCurrentSection(7)
  }

  const handleEmploymentInformationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedSourceCount = Object.values(formData.firstJobSources).filter(Boolean).length
    if (selectedSourceCount === 0) {
      setFirstJobSourceError("Please select at least one option for how you found your first job.")
      return
    }

    setCurrentSection(8)
  }

  const handleUnemploymentInformationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const requiresUnemploymentReason =
      formData.employmentStatus === "Unemployed" || formData.employmentStatus === "Currently studying"

    if (requiresUnemploymentReason) {
      const selectedReasonCount = Object.values(formData.unemploymentReasons).filter(Boolean).length
      if (selectedReasonCount === 0) {
        setUnemploymentReasonError("Please select at least one reason for unemployment.")
        return
      }
    }

    setCurrentSection(9)
  }

  const handleRelevanceOfEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setCurrentSection(10)
  }

  const handleProgramEvaluationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setCurrentSection(11)
  }

  const handlePreferredCommunicationEventsSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedInvitationChannelsCount = Object.values(formData.invitationChannels).filter(Boolean).length
    if (selectedInvitationChannelsCount === 0) {
      setInvitationChannelError("Please select at least one preferred communication channel.")
      return
    }

    if (formData.alumniGroupWillingness === "Yes" && !formData.alumniPlatform) {
      setAlumniPlatformError("Please select your preferred alumni platform.")
      return
    }

    setIsSubmitted(true)
    onSurveyComplete?.()
  }

  const handleStartNewSurvey = () => {
    setFormData(createInitialFormData())
    setCurrentSection(1)
    setConsentDeclined(false)
    setHonorsError("")
    setFirstJobSourceError("")
    setUnemploymentReasonError("")
    setInvitationChannelError("")
    setAlumniPlatformError("")
    setIsSubmitted(false)
  }

  return (
    <SurveyShell>
      {isSubmitted ? (
        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon">Section 12 of 12</div>
          <h2 className="text-2xl font-bold text-maroon">Thank You for Your Participation!</h2>
          <p className="text-foreground leading-relaxed">
            Thank you very much for taking the time to complete this survey. Your responses are <span className="font-semibold">highly valuable</span> and will
            help the <span className="font-semibold">CIT-U Nursing Program</span> track alumni outcomes, improve the curriculum, and support future innovations
            in education.
          </p>
          <p className="text-foreground leading-relaxed">
            Rest assured that all information you provided will remain <span className="font-semibold">confidential</span> and will only be used for <span className="font-semibold">academic research purposes</span>.
          </p>
          <p className="text-foreground leading-relaxed">
            We truly appreciate your cooperation and contribution to this study. Your input makes a difference! 😊
          </p>
          <div className="pt-2">
            <Button type="button" onClick={handleStartNewSurvey} className="bg-gold text-maroon hover:bg-gold/90 font-semibold">
              Start New Survey
            </Button>
          </div>
        </div>
      ) : currentSection === 1 ? (
        <SurveySectionIntro email={formData.email} onEmailChange={handleEmailChange} onContinue={handleContinueToConsent} />
      ) : currentSection === 2 ? (
        <SurveySectionConsent
          consent={formData.consent}
          consentDeclined={consentDeclined}
          onConsentChange={handleConsentChange}
          onBack={() => setCurrentSection(1)}
          onSubmit={handleConsentSubmit}
        />
      ) : currentSection === 3 ? (
        <SurveySectionPersonalInfo
          fullName={formData.fullName}
          gender={formData.gender}
          genderOther={formData.genderOther}
          civilStatus={formData.civilStatus}
          civilStatusOther={formData.civilStatusOther}
          birthday={formData.birthday}
          residence={formData.residence}
          contactInformation={formData.contactInformation}
          onTextChange={handleTextChange}
          onGenderChange={handleGenderChange}
          onCivilStatusChange={handleCivilStatusChange}
          onBack={() => setCurrentSection(2)}
          onSubmit={handlePersonalInfoSubmit}
        />
      ) : currentSection === 4 ? (
        <SurveySectionEducationalBackground
          degreeProgramCompleted={formData.degreeProgramCompleted}
          yearGraduated={formData.yearGraduated}
          yearGraduatedOther={formData.yearGraduatedOther}
          academicHonors={formData.academicHonors}
          academicHonorsOtherText={formData.academicHonorsOtherText}
          pursuedFurtherStudies={formData.pursuedFurtherStudies}
          furtherDegreeProgram={formData.furtherDegreeProgram}
          honorsError={honorsError}
          onDegreeProgramChange={handleDegreeProgramChange}
          onYearGraduatedChange={handleYearGraduatedChange}
          onHonorChange={handleAcademicHonorChange}
          onTextChange={handleTextChange}
          onFurtherStudiesChange={handleFurtherStudiesChange}
          onBack={() => setCurrentSection(3)}
          onSubmit={handleEducationalSubmit}
        />
      ) : currentSection === 5 ? (
        <SurveySectionLicensureExamination
          hasTakenPnle={formData.hasTakenPnle}
          licensureStatus={formData.licensureStatus}
          pnleYearPassed={formData.pnleYearPassed}
          pnleYearPassedOther={formData.pnleYearPassedOther}
          examTakeCount={formData.examTakeCount}
          onHasTakenPnleChange={handleHasTakenPnleChange}
          onLicensureStatusChange={handleLicensureStatusChange}
          onPnleYearPassedChange={handlePnleYearPassedChange}
          onExamTakeCountChange={handleExamTakeCountChange}
          onTextChange={handleTextChange}
          onBack={() => setCurrentSection(4)}
          onSubmit={handleLicensureSubmit}
        />
      ) : currentSection === 6 ? (
        <SurveySectionEmploymentStatus
          employmentStatus={formData.employmentStatus}
          onEmploymentStatusChange={handleEmploymentStatusChange}
          onBack={() => setCurrentSection(5)}
          onSubmit={handleEmploymentSubmit}
        />
      ) : currentSection === 7 ? (
        <SurveySectionEmploymentInformation
          jobRelatedToDegree={formData.jobRelatedToDegree}
          employmentSector={formData.employmentSector}
          employmentSectorOther={formData.employmentSectorOther}
          positionDesignation={formData.positionDesignation}
          positionDesignationOther={formData.positionDesignationOther}
          firstJobDuration={formData.firstJobDuration}
          firstJobSources={formData.firstJobSources}
          firstJobSourceOtherText={formData.firstJobSourceOtherText}
          estimatedMonthlySalary={formData.estimatedMonthlySalary}
          firstJobSourceError={firstJobSourceError}
          onJobRelatedToDegreeChange={handleJobRelatedToDegreeChange}
          onEmploymentSectorChange={handleEmploymentSectorChange}
          onPositionDesignationChange={handlePositionDesignationChange}
          onFirstJobDurationChange={handleFirstJobDurationChange}
          onFirstJobSourceChange={handleFirstJobSourceChange}
          onEstimatedMonthlySalaryChange={handleEstimatedMonthlySalaryChange}
          onTextChange={handleTextChange}
          onBack={() => setCurrentSection(6)}
          onSubmit={handleEmploymentInformationSubmit}
        />
      ) : currentSection === 8 ? (
        <SurveySectionUnemploymentInformation
          unemploymentReasons={formData.unemploymentReasons}
          unemploymentReasonOtherText={formData.unemploymentReasonOtherText}
          unemploymentReasonError={unemploymentReasonError}
          onUnemploymentReasonChange={handleUnemploymentReasonChange}
          onTextChange={handleTextChange}
          onBack={() =>
            setCurrentSection(
              formData.employmentStatus === "Unemployed" || formData.employmentStatus === "Currently studying" ? 6 : 7,
            )
          }
          onSubmit={handleUnemploymentInformationSubmit}
        />
      ) : currentSection === 9 ? (
        <SurveySectionRelevanceOfEducation
          relevanceSkills={formData.relevanceSkills}
          onRelevanceSkillChange={handleRelevanceSkillChange}
          onBack={() => setCurrentSection(8)}
          onSubmit={handleRelevanceOfEducationSubmit}
        />
      ) : currentSection === 10 ? (
        <SurveySectionProgramEvaluation
          careerPreparationLevel={formData.careerPreparationLevel}
          nursingProgramAspect={formData.nursingProgramAspect}
          nursingProgramSuggestion={formData.nursingProgramSuggestion}
          onCareerPreparationLevelChange={handleCareerPreparationLevelChange}
          onProgramEvaluationTextChange={handleProgramEvaluationTextChange}
          onBack={() => setCurrentSection(9)}
          onSubmit={handleProgramEvaluationSubmit}
        />
      ) : (
        <SurveySectionPreferredCommunicationEvents
          invitationChannels={formData.invitationChannels}
          invitationChannelOtherText={formData.invitationChannelOtherText}
          invitationChannelError={invitationChannelError}
          updateFrequency={formData.updateFrequency}
          alumniGroupWillingness={formData.alumniGroupWillingness}
          alumniPlatform={formData.alumniPlatform}
          alumniPlatformError={alumniPlatformError}
          onInvitationChannelChange={handleInvitationChannelChange}
          onUpdateFrequencyChange={handleUpdateFrequencyChange}
          onAlumniGroupWillingnessChange={handleAlumniGroupWillingnessChange}
          onAlumniPlatformChange={handleAlumniPlatformChange}
          onTextChange={handleTextChange}
          onBack={() => setCurrentSection(10)}
          onSubmit={handlePreferredCommunicationEventsSubmit}
        />
      )}
    </SurveyShell>
  )
}
