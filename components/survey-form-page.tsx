"use client"

import type React from "react"

import { useState } from "react"
import SurveyShell from "@/components/survey-shell"
import SurveySectionConsent from "@/components/survey-section-consent"
import SurveySectionEducationalBackground from "@/components/survey-section-educational-background"
import SurveySectionEmploymentInformation from "@/components/survey-section-employment-information"
import SurveySectionEmploymentStatus from "@/components/survey-section-employment-status"
import SurveySectionLicensureExamination from "@/components/survey-section-licensure-examination"
import SurveySectionPersonalInfo from "@/components/survey-section-personal-info"
import SurveySectionPreferredCommunicationEvents from "@/components/survey-section-preferred-communication-events"
import SurveySectionProgramEvaluation from "@/components/survey-section-program-evaluation"
import SurveySectionRelevanceOfEducation from "@/components/survey-section-relevance-of-education"
import SurveySectionUnemploymentInformation from "@/components/survey-section-unemployment-information"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  furtherStudiesReason: "",
  furtherStudiesReasonOther: "",
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

const hasAtLeastOneChecked = (values: Record<string, boolean>) => Object.values(values).some(Boolean)

export default function SurveyFormPage({ onSurveyComplete }: SurveyFormPageProps) {
  const [formData, setFormData] = useState(createInitialFormData)
  const [consentDeclined, setConsentDeclined] = useState(false)
  const [honorsError, setHonorsError] = useState("")
  const [firstJobSourceError, setFirstJobSourceError] = useState("")
  const [unemploymentReasonError, setUnemploymentReasonError] = useState("")
  const [invitationChannelError, setInvitationChannelError] = useState("")
  const [alumniPlatformError, setAlumniPlatformError] = useState("")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isConsentStepComplete, setIsConsentStepComplete] = useState(false)

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

  const handleConsentChange = (value: "yes" | "no") => {
    setFormData((prev) => ({
      ...prev,
      consent: value,
    }))

    if (value === "no") {
      setConsentDeclined(true)
      setIsConsentStepComplete(false)
      setFormError("")
      return
    }

    setConsentDeclined(false)
    setIsConsentStepComplete(false)
    setFormError("")
  }

  const handleConsentPageSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.consent === "yes") {
      setConsentDeclined(false)
      setFormError("")
      setIsConsentStepComplete(true)
      return
    }

    if (formData.consent === "no") {
      setConsentDeclined(true)
      setIsConsentStepComplete(false)
      setFormError("")
      return
    }

    setFormError("Please choose whether you agree to participate before continuing.")
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
      furtherStudiesReason: value === "Yes" ? prev.furtherStudiesReason : "",
      furtherStudiesReasonOther: value === "Yes" ? prev.furtherStudiesReasonOther : "",
    }))
  }

  const handleFurtherStudiesReasonChange = (value: "For promotions" | "For professional development" | "Other") => {
    setFormData((prev) => ({
      ...prev,
      furtherStudiesReason: value,
      furtherStudiesReasonOther: value === "Other" ? prev.furtherStudiesReasonOther : "",
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
    setFirstJobSourceError("")
    setUnemploymentReasonError("")
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

  const handleCombinedSubmit = async () => {
    if (isSubmitting) {
      return
    }

    if (formData.consent === "no") {
      setConsentDeclined(true)
      setFormError("")
      return
    }

    if (formData.consent !== "yes") {
      setConsentDeclined(false)
      setFormError("Please select “Yes, I voluntarily agree to participate” before submitting.")
      return
    }

    let hasError = false

    const requiresEmploymentInformation =
      formData.employmentStatus === "Employed" || formData.employmentStatus === "Self employed"
    const requiresUnemploymentReason =
      formData.employmentStatus === "Unemployed" || formData.employmentStatus === "Currently studying"
    const requiresFurtherStudiesDetails = formData.pursuedFurtherStudies === "Yes"

    setConsentDeclined(false)

    if (!hasAtLeastOneChecked(formData.academicHonors)) {
      setHonorsError("Please select at least one option for academic honor.")
      hasError = true
    } else {
      setHonorsError("")
    }

    if (requiresEmploymentInformation && !hasAtLeastOneChecked(formData.firstJobSources)) {
      setFirstJobSourceError("Please select at least one option for how you found your first job.")
      hasError = true
    } else {
      setFirstJobSourceError("")
    }

    if (requiresUnemploymentReason && !hasAtLeastOneChecked(formData.unemploymentReasons)) {
      setUnemploymentReasonError("Please select at least one reason for unemployment.")
      hasError = true
    } else {
      setUnemploymentReasonError("")
    }

    if (!hasAtLeastOneChecked(formData.invitationChannels)) {
      setInvitationChannelError("Please select at least one preferred communication channel.")
      hasError = true
    } else {
      setInvitationChannelError("")
    }

    if (formData.alumniGroupWillingness === "Yes" && !formData.alumniPlatform) {
      setAlumniPlatformError("Please select your preferred alumni platform.")
      hasError = true
    } else {
      setAlumniPlatformError("")
    }

    if (
      requiresFurtherStudiesDetails &&
      (!formData.furtherDegreeProgram.trim() ||
        !formData.furtherStudiesReason ||
        (formData.furtherStudiesReason === "Other" && !formData.furtherStudiesReasonOther.trim()))
    ) {
      hasError = true
    }

    const requiredValues = [
      formData.email.trim(),
      formData.fullName.trim(),
      formData.birthday,
      formData.residence.trim(),
      formData.contactInformation.trim(),
      formData.degreeProgramCompleted,
      formData.yearGraduated,
      formData.hasTakenPnle,
      formData.employmentStatus,
      formData.careerPreparationLevel,
      formData.nursingProgramAspect.trim(),
      formData.nursingProgramSuggestion.trim(),
      formData.updateFrequency,
      formData.alumniGroupWillingness,
    ]

    if (requiredValues.some((value) => !value)) {
      hasError = true
    }

    if (hasError) {
      setFormError("Please complete all required fields and resolve highlighted sections before submitting.")
      return
    }

    setFormError("")

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/survey-responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        let message = "Unable to submit survey right now. Please try again."

        try {
          const payload = (await response.json()) as { message?: unknown }
          if (typeof payload.message === "string" && payload.message.trim()) {
            message = payload.message
          }
        } catch {
          message = "Unable to submit survey right now. Please try again."
        }

        setFormError(message)
        return
      }

      setIsSubmitted(true)
      onSurveyComplete?.()
    } catch {
      setFormError("Unable to reach the server. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStartNewSurvey = () => {
    setFormData(createInitialFormData())
    setConsentDeclined(false)
    setHonorsError("")
    setFirstJobSourceError("")
    setUnemploymentReasonError("")
    setInvitationChannelError("")
    setAlumniPlatformError("")
    setFormError("")
    setIsSubmitting(false)
    setIsSubmitted(false)
    setIsConsentStepComplete(false)
  }

  const preventSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const noop = () => {}

  const showEmploymentInformation = formData.employmentStatus === "Employed" || formData.employmentStatus === "Self employed"
  const showUnemploymentInformation =
    formData.employmentStatus === "Unemployed" || formData.employmentStatus === "Currently studying"

  return (
    <SurveyShell>
      {isSubmitted ? (
        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <h2 className="text-2xl font-bold text-maroon">Thank You for Completing the Alumni Tracer Survey!</h2>
          <p className="text-foreground leading-relaxed">
            Your responses are valuable and will help improve curriculum, alumni support services, and future educational initiatives.
          </p>
          <p className="text-foreground leading-relaxed">
            All submitted information will be handled with confidentiality and used for academic and institutional development purposes.
          </p>
          <div className="pt-2">
            <Button type="button" onClick={handleStartNewSurvey} className="bg-gold text-maroon hover:bg-gold/90 font-semibold">
              Start New Survey
            </Button>
          </div>
        </div>
      ) : formData.consent === "no" ? (
        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <h2 className="text-2xl font-bold text-maroon">Survey Ended</h2>
          <p className="text-foreground leading-relaxed">You chose not to participate in the study.</p>
          <p className="text-foreground leading-relaxed">Thank you for your time.</p>
          <div className="pt-2">
            <Button type="button" onClick={handleStartNewSurvey} className="bg-gold text-maroon hover:bg-gold/90 font-semibold">
              Start Survey Again
            </Button>
          </div>
        </div>
      ) : !isConsentStepComplete ? (
        <div className="space-y-6">
          <div className="rounded-lg border border-maroon/20 p-5 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-maroon">Alumni Tracer Survey</p>
            <h2 className="text-3xl font-bold text-maroon">Data Privacy and Informed Consent</h2>
            <p className="text-foreground leading-relaxed">
              Please review the consent statement below before proceeding to the survey form.
            </p>
          </div>

          <SurveySectionConsent
            consent={formData.consent}
            consentDeclined={consentDeclined}
            onConsentChange={handleConsentChange}
            onSubmit={handleConsentPageSubmit}
          />

          {formError && <p className="text-sm text-maroon font-medium">{formError}</p>}
        </div>
      ) : (
        <div className="combined-survey space-y-6">
          <div className="rounded-lg border border-maroon/20 p-5 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-maroon">Alumni Tracer Survey</p>
            <h2 className="text-3xl font-bold text-maroon">Please take a few minutes to answer this survey</h2>
            <p className="text-foreground leading-relaxed">
              Your participation is voluntary, and all responses will be kept confidential. The information you provide will be used solely
              for research and program improvement purposes.
            </p>
          </div>

          <div className="rounded-lg border border-maroon/20 bg-muted/20 px-4 py-3">
            <h3 className="text-lg font-bold text-maroon">A. GENERAL INFORMATION</h3>
          </div>

          <div className="rounded-lg border border-maroon/20 p-5 space-y-2">
            <Label htmlFor="email" className="text-foreground text-base">
              Email <span className="text-maroon">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Short answer text"
              value={formData.email}
              onChange={handleEmailChange}
              className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
              required
            />
          </div>

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
            onBack={noop}
            onSubmit={preventSectionSubmit}
          />

          <div className="rounded-lg border border-maroon/20 bg-muted/20 px-4 py-3">
            <h3 className="text-lg font-bold text-maroon">B. EDUCATIONAL BACKGROUND</h3>
          </div>

          <SurveySectionEducationalBackground
            degreeProgramCompleted={formData.degreeProgramCompleted}
            yearGraduated={formData.yearGraduated}
            yearGraduatedOther={formData.yearGraduatedOther}
            academicHonors={formData.academicHonors}
            academicHonorsOtherText={formData.academicHonorsOtherText}
            pursuedFurtherStudies={formData.pursuedFurtherStudies}
            furtherDegreeProgram={formData.furtherDegreeProgram}
            furtherStudiesReason={formData.furtherStudiesReason}
            furtherStudiesReasonOther={formData.furtherStudiesReasonOther}
            honorsError={honorsError}
            onDegreeProgramChange={handleDegreeProgramChange}
            onYearGraduatedChange={handleYearGraduatedChange}
            onHonorChange={handleAcademicHonorChange}
            onTextChange={handleTextChange}
            onFurtherStudiesChange={handleFurtherStudiesChange}
            onFurtherStudiesReasonChange={handleFurtherStudiesReasonChange}
            onBack={noop}
            onSubmit={preventSectionSubmit}
          />

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
            onBack={noop}
            onSubmit={preventSectionSubmit}
          />

          <div className="rounded-lg border border-maroon/20 bg-muted/20 px-4 py-3">
            <h3 className="text-lg font-bold text-maroon">C. EMPLOYMENT DATA</h3>
          </div>

          <SurveySectionEmploymentStatus
            employmentStatus={formData.employmentStatus}
            onEmploymentStatusChange={handleEmploymentStatusChange}
            onBack={noop}
            onSubmit={preventSectionSubmit}
          />

          {showEmploymentInformation && (
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
              onBack={noop}
              onSubmit={preventSectionSubmit}
            />
          )}

          {showUnemploymentInformation && (
            <SurveySectionUnemploymentInformation
              unemploymentReasons={formData.unemploymentReasons}
              unemploymentReasonOtherText={formData.unemploymentReasonOtherText}
              unemploymentReasonError={unemploymentReasonError}
              onUnemploymentReasonChange={handleUnemploymentReasonChange}
              onTextChange={handleTextChange}
              onBack={noop}
              onSubmit={preventSectionSubmit}
            />
          )}

          <div className="rounded-lg border border-maroon/20 bg-muted/20 px-4 py-3">
            <h3 className="text-lg font-bold text-maroon">D. PROGRAM FEEDBACK</h3>
          </div>

          <SurveySectionRelevanceOfEducation
            relevanceSkills={formData.relevanceSkills}
            onRelevanceSkillChange={handleRelevanceSkillChange}
            onBack={noop}
            onSubmit={preventSectionSubmit}
          />

          <SurveySectionProgramEvaluation
            careerPreparationLevel={formData.careerPreparationLevel}
            nursingProgramAspect={formData.nursingProgramAspect}
            nursingProgramSuggestion={formData.nursingProgramSuggestion}
            onCareerPreparationLevelChange={handleCareerPreparationLevelChange}
            onProgramEvaluationTextChange={handleProgramEvaluationTextChange}
            onBack={noop}
            onSubmit={preventSectionSubmit}
          />

          <div className="rounded-lg border border-maroon/20 bg-muted/20 px-4 py-3">
            <h3 className="text-lg font-bold text-maroon">E. PREFERRED COMMUNICATION EVENTS</h3>
          </div>

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
            onBack={noop}
            onSubmit={preventSectionSubmit}
          />

          <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
            <p className="text-sm text-foreground leading-relaxed">
              By clicking submit, you certify that the information provided is true and you agree to the terms and privacy consent for this
              Alumni Tracer Survey.
            </p>

            {formError && <p className="text-sm text-maroon font-medium">{formError}</p>}

            <Button
              type="button"
              onClick={handleCombinedSubmit}
              className="bg-gold text-maroon hover:bg-gold/90 font-semibold px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </Button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .combined-survey form > div.flex.gap-3.pt-2 {
          display: none;
        }
      `}</style>
    </SurveyShell>
  )
}

// This file combines all the individual survey sections into a single page and manages the overall form state, validation, and submission logic.