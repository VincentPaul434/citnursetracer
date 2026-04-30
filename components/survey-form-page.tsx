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
  idUploadUrl: "",
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
  const [idFile, setIdFile] = useState<File | null>(null)
  const [idUploadError, setIdUploadError] = useState("")
  const [idUploadStatus, setIdUploadStatus] = useState("")
  const [isUploadingId, setIsUploadingId] = useState(false)
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
      pnleYearPassed: value === "Passed" ? prev.pnleYearPassed : "",
      pnleYearPassedOther: value === "Passed" ? prev.pnleYearPassedOther : "",
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

  const getUploadMessage = (payload: unknown) => {
    if (!payload || typeof payload !== "object") {
      return null
    }

    const message = (payload as { message?: unknown }).message
    if (typeof message !== "string") {
      return null
    }

    const trimmed = message.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  const getUploadUrl = (payload: unknown) => {
    if (!payload || typeof payload !== "object") {
      return null
    }

    const candidateKeys = ["url", "idUrl", "fileUrl", "downloadUrl", "location", "path"] as const
    const payloadRecord = payload as Record<string, unknown>

    for (const key of candidateKeys) {
      const value = payloadRecord[key]
      if (typeof value === "string" && value.trim().length > 0) {
        return value.trim()
      }
    }

    return null
  }

  const handleIdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setIdFile(file)
    setIdUploadError("")
    setIdUploadStatus("")

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        idUploadUrl: "",
      }))
    }
  }

  const uploadSelectedId = async () => {
    if (!idFile) {
      setIdUploadError("Please choose a file to upload.")
      return false
    }

    try {
      setIsUploadingId(true)
      setIdUploadError("")
      setIdUploadStatus("")

      const uploadFormData = new FormData()
      uploadFormData.append("file", idFile)

      const response = await fetch("/api/id-upload", {
        method: "POST",
        body: uploadFormData,
      })

      const payload = (await response.json().catch(() => null)) as unknown

      if (!response.ok) {
        setIdUploadError(getUploadMessage(payload) ?? "Unable to upload ID right now. Please try again.")
        return false
      }

      const uploadedUrl = getUploadUrl(payload)

      setFormData((prev) => ({
        ...prev,
        idUploadUrl: uploadedUrl ?? prev.idUploadUrl,
      }))

      if (uploadedUrl) {
        setIdUploadStatus("ID uploaded successfully.")
      } else {
        setIdUploadStatus("ID uploaded successfully. URL was not provided by the server.")
      }

      return true
    } catch {
      setIdUploadError("Unable to reach the upload service. Please check your connection and try again.")
      return false
    } finally {
      setIsUploadingId(false)
    }
  }

  const handleIdUpload = async () => {
    await uploadSelectedId()
  }

  const handleCombinedSubmit = async () => {
    if (isSubmitting || isUploadingId) {
      if (isUploadingId) {
        setFormError("Please wait for the ID upload to finish before submitting.")
      }
      return
    }

    if (idFile && !formData.idUploadUrl) {
      const hasUploaded = await uploadSelectedId()

      if (!hasUploaded) {
        setFormError("Please resolve the ID upload issue or remove the selected file before submitting.")
        return
      }
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
    setIdFile(null)
    setIdUploadError("")
    setIdUploadStatus("")
    setIsUploadingId(false)
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

  const isGeneralInfoComplete =
    Boolean(formData.email.trim()) &&
    Boolean(formData.fullName.trim()) &&
    Boolean(formData.birthday) &&
    Boolean(formData.residence.trim()) &&
    Boolean(formData.contactInformation.trim())

  const isEducationalBackgroundComplete =
    Boolean(formData.degreeProgramCompleted) && Boolean(formData.yearGraduated) && hasAtLeastOneChecked(formData.academicHonors)

  const hasEmploymentDetailSelected =
    (showEmploymentInformation && hasAtLeastOneChecked(formData.firstJobSources)) ||
    (showUnemploymentInformation && hasAtLeastOneChecked(formData.unemploymentReasons)) ||
    (!showEmploymentInformation && !showUnemploymentInformation)

  const isEmploymentDataComplete = Boolean(formData.employmentStatus) && hasEmploymentDetailSelected

  const isProgramFeedbackComplete =
    Boolean(formData.careerPreparationLevel) &&
    Boolean(formData.nursingProgramAspect.trim()) &&
    Boolean(formData.nursingProgramSuggestion.trim())

  const isCommunicationPreferenceComplete =
    hasAtLeastOneChecked(formData.invitationChannels) &&
    Boolean(formData.updateFrequency) &&
    Boolean(formData.alumniGroupWillingness) &&
    (formData.alumniGroupWillingness !== "Yes" || Boolean(formData.alumniPlatform))

  const sectionProgress = [
    {
      id: "section-general-information",
      shortLabel: "A",
      title: "General Information",
      description: "Basic graduate profile and contact details.",
      complete: isGeneralInfoComplete,
    },
    {
      id: "section-educational-background",
      shortLabel: "B",
      title: "Educational Background",
      description: "Academic record and post-graduate learning details.",
      complete: isEducationalBackgroundComplete,
    },
    {
      id: "section-employment-data",
      shortLabel: "C",
      title: "Employment Data",
      description: "Career status and transition-to-work experience.",
      complete: isEmploymentDataComplete,
    },
    {
      id: "section-program-feedback",
      shortLabel: "D",
      title: "Program Feedback",
      description: "Reflection on preparedness and curriculum outcomes.",
      complete: isProgramFeedbackComplete,
    },
    {
      id: "section-preferred-communication-events",
      shortLabel: "E",
      title: "Preferred Communication Events",
      description: "How alumni updates and invitations should reach you.",
      complete: isCommunicationPreferenceComplete,
    },
  ] as const

  const completedSections = sectionProgress.filter((section) => section.complete).length
  const completionPercent = Math.round((completedSections / sectionProgress.length) * 100)

  const SectionHeader = ({
    sectionId,
    shortLabel,
    title,
    description,
    complete,
  }: {
    sectionId: string
    shortLabel: string
    title: string
    description: string
    complete: boolean
  }) => (
    <div id={sectionId} className="relative overflow-hidden rounded-xl border border-maroon/20 bg-white/80 p-4 md:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.85_0.12_75/.25),transparent_60%)]" />
      <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-maroon/30 bg-maroon text-sm font-bold text-gold">
            {shortLabel}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-maroon">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <p
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            complete ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-maroon/10 text-maroon border border-maroon/20"
          }`}
        >
          {complete ? "Section completed" : "In progress"}
        </p>
      </div>
    </div>
  )

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
          <div className="relative overflow-hidden rounded-xl border border-maroon/20 bg-gradient-to-br from-white via-white to-gold/20 p-5 md:p-7 space-y-4">
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-maroon/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 left-8 h-28 w-28 rounded-full bg-gold/50 blur-xl" />
            <p className="text-sm font-semibold uppercase tracking-wide text-maroon">Alumni Tracer Survey</p>
            <h2 className="text-3xl font-bold text-maroon">Data Privacy and Informed Consent</h2>
            <p className="max-w-3xl text-foreground leading-relaxed">
              Please review the consent statement below before proceeding to the survey form.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full border border-maroon/20 bg-white px-3 py-1 text-xs font-semibold text-maroon">Estimated Time: 8-10 minutes</span>
              <span className="rounded-full border border-maroon/20 bg-white px-3 py-1 text-xs font-semibold text-maroon">Confidential Responses</span>
              <span className="rounded-full border border-maroon/20 bg-white px-3 py-1 text-xs font-semibold text-maroon">Curriculum Improvement Use</span>
            </div>
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
          <div className="relative overflow-hidden rounded-2xl border border-maroon/20 bg-gradient-to-br from-white via-gold/10 to-white p-5 md:p-7 shadow-[0_16px_40px_-24px_rgba(80,30,38,0.65)]">
            <div className="pointer-events-none absolute -right-16 -top-12 h-52 w-52 rounded-full bg-maroon/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-gold/30 blur-2xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-maroon">CIT-U Alumni Tracer 2026</p>
                <h2 className="text-3xl font-black leading-tight text-maroon md:text-4xl">Help Shape the Future of the Nursing Program</h2>
                <p className="max-w-2xl text-foreground leading-relaxed">
                  Your participation is voluntary, and all responses will remain confidential. Insights from this survey directly support
                  curriculum planning, alumni engagement initiatives, and student career readiness.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="rounded-full border border-maroon/20 bg-white px-3 py-1 text-xs font-semibold text-maroon">One-time survey</span>
                  <span className="rounded-full border border-maroon/20 bg-white px-3 py-1 text-xs font-semibold text-maroon">Mobile-friendly</span>
                  <span className="rounded-full border border-maroon/20 bg-white px-3 py-1 text-xs font-semibold text-maroon">Secure submission</span>
                </div>
              </div>

              <div className="rounded-xl border border-maroon/20 bg-white/90 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Survey progress</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-black text-maroon">{completionPercent}%</p>
                  <p className="text-sm text-muted-foreground">
                    {completedSections} of {sectionProgress.length} sections complete
                  </p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-maroon/10">
                  <div className="h-full rounded-full bg-maroon transition-all duration-500" style={{ width: `${completionPercent}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">Complete each section below, then submit at the bottom of the page.</p>
              </div>
            </div>
          </div>

          <div className="sticky top-2 z-10 rounded-xl border border-maroon/20 bg-white/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-white/75">
            <div className="flex flex-wrap gap-2">
              {sectionProgress.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    section.complete
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-maroon/20 bg-white text-maroon hover:bg-maroon/5"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${section.complete ? "bg-emerald-500" : "bg-maroon/35"}`}
                    aria-hidden="true"
                  />
                  {section.shortLabel}. {section.title}
                </a>
              ))}
            </div>
          </div>

          <SectionHeader
            sectionId="section-general-information"
            shortLabel="A"
            title="General Information"
            description="Basic graduate profile and contact details."
            complete={isGeneralInfoComplete}
          />

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

          <div className="rounded-lg border border-maroon/20 p-5 space-y-3">
            <Label htmlFor="idUpload" className="text-foreground text-base">
              Alumni ID Upload <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Upload a photo or PDF copy of your alumni ID for verification. This does not affect your ability to submit the survey.
            </p>
            <Input
              id="idUpload"
              type="file"
              accept="image/*,.pdf"
              onChange={handleIdFileChange}
              className="bg-white text-foreground border-maroon/20 file:text-maroon file:font-semibold"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleIdUpload}
                disabled={!idFile || isUploadingId || isSubmitting}
                className="bg-white text-maroon border border-maroon/20 hover:bg-maroon/5"
              >
                {isUploadingId ? "Uploading Alumni ID..." : "Upload Alumni ID"}
              </Button>
              {formData.idUploadUrl && (
                <p className="text-xs text-emerald-700 break-all">Uploaded URL: {formData.idUploadUrl}</p>
              )}
            </div>
            {idUploadStatus && <p className="text-sm text-emerald-700 font-medium">{idUploadStatus}</p>}
            {idUploadError && <p className="text-sm text-maroon font-medium">{idUploadError}</p>}
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

          <SectionHeader
            sectionId="section-educational-background"
            shortLabel="B"
            title="Educational Background"
            description="Academic record and post-graduate learning details."
            complete={isEducationalBackgroundComplete}
          />

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

          <SectionHeader
            sectionId="section-employment-data"
            shortLabel="C"
            title="Employment Data"
            description="Career status and transition-to-work experience."
            complete={isEmploymentDataComplete}
          />

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

          <SectionHeader
            sectionId="section-program-feedback"
            shortLabel="D"
            title="Program Feedback"
            description="Reflection on preparedness and curriculum outcomes."
            complete={isProgramFeedbackComplete}
          />

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

          <SectionHeader
            sectionId="section-preferred-communication-events"
            shortLabel="E"
            title="Preferred Communication Events"
            description="How alumni updates and invitations should reach you."
            complete={isCommunicationPreferenceComplete}
          />

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
              disabled={isSubmitting || isUploadingId}
            >
              {isSubmitting ? "Submitting..." : isUploadingId ? "Uploading Alumni ID..." : "Submit Survey"}
            </Button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .combined-survey form > div.flex.gap-3.pt-2 {
          display: none;
        }

        @media (prefers-reduced-motion: no-preference) {
          .combined-survey > div:first-child {
            animation: hero-fade 550ms ease-out;
          }

          @keyframes hero-fade {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      `}</style>
    </SurveyShell>
  )
}

// This file combines all the individual survey sections into a single page and manages the overall form state, validation, and submission logic.