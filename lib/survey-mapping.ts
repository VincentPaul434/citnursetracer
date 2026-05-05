export const EDIT_TOKEN_PARAM = "editToken"

export const createInitialFormData = () => ({
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

export type SurveyFormData = ReturnType<typeof createInitialFormData>

export const hasAtLeastOneChecked = (values: Record<string, boolean>) => Object.values(values).some(Boolean)

const sanitizeBooleanGroup = <T extends Record<string, boolean>>(value: unknown, fallback: T) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallback
  }

  const record = value as Record<string, unknown>
  const merged = { ...fallback } as T
  const mergedRecord = merged as Record<string, boolean>

  for (const key of Object.keys(fallback)) {
    if (typeof record[key] === "boolean") {
      mergedRecord[key] = record[key] as boolean
    }
  }

  return merged
}

const stringFields = [
  "email",
  "idUploadUrl",
  "consent",
  "fullName",
  "gender",
  "genderOther",
  "civilStatus",
  "civilStatusOther",
  "birthday",
  "residence",
  "contactInformation",
  "degreeProgramCompleted",
  "yearGraduated",
  "yearGraduatedOther",
  "academicHonorsOtherText",
  "pursuedFurtherStudies",
  "furtherDegreeProgram",
  "furtherStudiesReason",
  "furtherStudiesReasonOther",
  "hasTakenPnle",
  "licensureStatus",
  "pnleYearPassed",
  "pnleYearPassedOther",
  "examTakeCount",
  "employmentStatus",
  "jobRelatedToDegree",
  "employmentSector",
  "employmentSectorOther",
  "positionDesignation",
  "positionDesignationOther",
  "firstJobDuration",
  "firstJobSourceOtherText",
  "estimatedMonthlySalary",
  "unemploymentReasonOtherText",
  "careerPreparationLevel",
  "nursingProgramAspect",
  "nursingProgramSuggestion",
  "invitationChannelOtherText",
  "updateFrequency",
  "alumniGroupWillingness",
  "alumniPlatform",
] as const

const toBooleanGroup = <T extends Record<string, boolean>>(value: unknown, fallback: T) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return sanitizeBooleanGroup(value, fallback)
  }

  const merged = { ...fallback } as T
  const mergedRecord = merged as Record<string, boolean>
  const selected = new Set<string>()

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string" && item.trim()) {
        selected.add(item.trim())
      }
    }
  } else if (typeof value === "string" && value.trim()) {
    for (const item of value.split(",")) {
      const trimmed = item.trim()
      if (trimmed) {
        selected.add(trimmed)
      }
    }
  }

  for (const key of Object.keys(mergedRecord)) {
    mergedRecord[key] = selected.has(key)
  }

  return merged
}

export const createFormDataFromPayload = (payload: unknown): SurveyFormData => {
  const initial = createInitialFormData()

  if (!payload || typeof payload !== "object") {
    return initial
  }

  const record = payload as Record<string, unknown>
  const personalInfo = (record.personalInfo ?? record.personal_info) as Record<string, unknown> | undefined
  const educationalBackground = (record.educationalBackground ?? record.educational_background) as
    | Record<string, unknown>
    | undefined
  const licensureExamination = (record.licensureExamination ?? record.licensure_examination) as
    | Record<string, unknown>
    | undefined
  const employment = record.employment as Record<string, unknown> | undefined
  const programEvaluation = (record.programEvaluation ?? record.program_evaluation) as Record<string, unknown> | undefined
  const communicationPreference = (record.communicationPreference ?? record.communication_preference) as
    | Record<string, unknown>
    | undefined
  const merged: SurveyFormData = {
    ...initial,
  }

  for (const field of stringFields) {
    if (typeof record[field] === "string") {
      merged[field] = record[field] as SurveyFormData[typeof field]
    } else if (typeof record[field] === "number") {
      merged[field] = String(record[field]) as SurveyFormData[typeof field]
    } else {
      merged[field] = initial[field]
    }
  }

  merged.email = typeof record.email === "string" ? record.email : merged.email
  merged.consent = record.hasAcceptedPrivacy === true ? "yes" : record.hasAcceptedPrivacy === false ? "no" : merged.consent

  if (personalInfo && typeof personalInfo === "object") {
    merged.fullName = typeof personalInfo.fullName === "string" ? personalInfo.fullName : merged.fullName
    merged.gender = typeof personalInfo.gender === "string" ? personalInfo.gender : merged.gender
    merged.genderOther = typeof personalInfo.genderOther === "string" ? personalInfo.genderOther : merged.genderOther
    merged.civilStatus = typeof personalInfo.civilStatus === "string" ? personalInfo.civilStatus : merged.civilStatus
    merged.civilStatusOther = typeof personalInfo.civilStatusOther === "string" ? personalInfo.civilStatusOther : merged.civilStatusOther
    merged.birthday = typeof personalInfo.birthday === "string" ? personalInfo.birthday : merged.birthday
    merged.residence = typeof personalInfo.residence === "string" ? personalInfo.residence : merged.residence
    merged.contactInformation =
      typeof personalInfo.contactInformation === "string" ? personalInfo.contactInformation : merged.contactInformation
    merged.idUploadUrl = typeof personalInfo.idImageUrl === "string" ? personalInfo.idImageUrl : merged.idUploadUrl
  }

  if (educationalBackground && typeof educationalBackground === "object") {
    merged.degreeProgramCompleted =
      typeof educationalBackground.degreeProgramCompleted === "string"
        ? educationalBackground.degreeProgramCompleted
        : merged.degreeProgramCompleted
    merged.yearGraduated =
      typeof educationalBackground.yearGraduated === "string" ? educationalBackground.yearGraduated : merged.yearGraduated
    merged.yearGraduatedOther =
      typeof educationalBackground.yearGraduatedOther === "string"
        ? educationalBackground.yearGraduatedOther
        : merged.yearGraduatedOther
    merged.academicHonorsOtherText =
      typeof educationalBackground.academicHonorsOtherText === "string"
        ? educationalBackground.academicHonorsOtherText
        : merged.academicHonorsOtherText
    merged.pursuedFurtherStudies =
      educationalBackground.pursuedFurtherStudies === true
        ? "Yes"
        : educationalBackground.pursuedFurtherStudies === false
          ? "No"
          : merged.pursuedFurtherStudies
    merged.furtherDegreeProgram =
      typeof educationalBackground.furtherDegreeProgram === "string"
        ? educationalBackground.furtherDegreeProgram
        : merged.furtherDegreeProgram
    merged.furtherStudiesReason =
      typeof educationalBackground.furtherStudiesReason === "string"
        ? educationalBackground.furtherStudiesReason
        : merged.furtherStudiesReason
    merged.furtherStudiesReasonOther =
      typeof educationalBackground.furtherStudiesReasonOtherText === "string"
        ? educationalBackground.furtherStudiesReasonOtherText
        : merged.furtherStudiesReasonOther
    merged.academicHonors = toBooleanGroup(educationalBackground.academicHonors, initial.academicHonors)
  } else {
    merged.academicHonors = toBooleanGroup(record.academicHonors ?? record.academic_honors, initial.academicHonors)
  }

  if (licensureExamination && typeof licensureExamination === "object") {
    merged.hasTakenPnle =
      licensureExamination.hasTakenPnle === true
        ? "Yes"
        : licensureExamination.hasTakenPnle === false
          ? "No"
          : merged.hasTakenPnle
    merged.licensureStatus =
      typeof licensureExamination.licensureStatus === "string" ? licensureExamination.licensureStatus : merged.licensureStatus
    merged.pnleYearPassed =
      typeof licensureExamination.pnleYearPassed === "string" ? licensureExamination.pnleYearPassed : merged.pnleYearPassed
    merged.pnleYearPassedOther =
      typeof licensureExamination.pnleYearPassedOther === "string"
        ? licensureExamination.pnleYearPassedOther
        : merged.pnleYearPassedOther
    merged.examTakeCount =
      typeof licensureExamination.examTakeCount === "string" ? licensureExamination.examTakeCount : merged.examTakeCount
  }

  if (employment && typeof employment === "object") {
    merged.employmentStatus =
      typeof employment.employmentStatus === "string" ? employment.employmentStatus : merged.employmentStatus
    merged.jobRelatedToDegree =
      employment.jobRelatedToDegree === true
        ? "Yes"
        : employment.jobRelatedToDegree === false
          ? "No"
          : merged.jobRelatedToDegree
    merged.employmentSector =
      typeof employment.employmentSector === "string" ? employment.employmentSector : merged.employmentSector
    merged.employmentSectorOther =
      typeof employment.employmentSectorOther === "string" ? employment.employmentSectorOther : merged.employmentSectorOther
    merged.positionDesignation =
      typeof employment.positionDesignation === "string" ? employment.positionDesignation : merged.positionDesignation
    merged.positionDesignationOther =
      typeof employment.positionDesignationOther === "string" ? employment.positionDesignationOther : merged.positionDesignationOther
    merged.firstJobDuration =
      typeof employment.firstJobDuration === "string" ? employment.firstJobDuration : merged.firstJobDuration
    merged.firstJobSourceOtherText =
      typeof employment.firstJobSourceOtherText === "string"
        ? employment.firstJobSourceOtherText
        : merged.firstJobSourceOtherText
    merged.estimatedMonthlySalary =
      typeof employment.estimatedMonthlySalary === "string" ? employment.estimatedMonthlySalary : merged.estimatedMonthlySalary
    merged.unemploymentReasonOtherText =
      typeof employment.unemploymentReasonOtherText === "string"
        ? employment.unemploymentReasonOtherText
        : merged.unemploymentReasonOtherText
    merged.firstJobSources = toBooleanGroup(employment.firstJobSources, initial.firstJobSources)
    merged.unemploymentReasons = toBooleanGroup(employment.unemploymentReasons, initial.unemploymentReasons)
  } else {
    merged.firstJobSources = toBooleanGroup(record.firstJobSources ?? record.first_job_sources, initial.firstJobSources)
    merged.unemploymentReasons = toBooleanGroup(record.unemploymentReasons ?? record.unemployment_reasons, initial.unemploymentReasons)
  }

  if (programEvaluation && typeof programEvaluation === "object") {
    merged.relevanceSkills = toBooleanGroup(programEvaluation.relevanceSkills, initial.relevanceSkills)
    merged.careerPreparationLevel =
      typeof programEvaluation.careerPreparationLevel === "string"
        ? programEvaluation.careerPreparationLevel
        : merged.careerPreparationLevel
    merged.nursingProgramAspect =
      typeof programEvaluation.nursingProgramAspect === "string"
        ? programEvaluation.nursingProgramAspect
        : merged.nursingProgramAspect
    merged.nursingProgramSuggestion =
      typeof programEvaluation.nursingProgramSuggestion === "string"
        ? programEvaluation.nursingProgramSuggestion
        : merged.nursingProgramSuggestion
  } else {
    merged.relevanceSkills = toBooleanGroup(record.relevanceSkills ?? record.relevance_skills, initial.relevanceSkills)
  }

  if (communicationPreference && typeof communicationPreference === "object") {
    merged.invitationChannels = toBooleanGroup(communicationPreference.invitationChannels, initial.invitationChannels)
    merged.invitationChannelOtherText =
      typeof communicationPreference.invitationChannelOtherText === "string"
        ? communicationPreference.invitationChannelOtherText
        : merged.invitationChannelOtherText
    merged.updateFrequency =
      typeof communicationPreference.updateFrequency === "string" ? communicationPreference.updateFrequency : merged.updateFrequency
    merged.alumniGroupWillingness =
      typeof communicationPreference.alumniGroupWillingness === "string"
        ? communicationPreference.alumniGroupWillingness
        : merged.alumniGroupWillingness
    merged.alumniPlatform =
      typeof communicationPreference.alumniPlatform === "string" ? communicationPreference.alumniPlatform : merged.alumniPlatform
  } else {
    merged.invitationChannels = toBooleanGroup(record.invitationChannels ?? record.invitation_channels, initial.invitationChannels)
  }

  return merged
}

export const extractEditToken = (payload: unknown) => {
  if (!payload || typeof payload !== "object") {
    return null
  }

  const record = payload as Record<string, unknown>
  const candidates = ["editToken", "edit_token", "token", "editTokenValue"]

  for (const key of candidates) {
    const value = record[key]
    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }

  return null
}
