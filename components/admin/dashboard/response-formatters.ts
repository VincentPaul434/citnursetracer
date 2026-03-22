const FIELD_LABELS: Record<string, string> = {
  email: "Email Address",
  consent: "Consent to Participate",
  fullName: "Full Name",
  gender: "Gender",
  genderOther: "Other Gender",
  civilStatus: "Civil Status",
  civilStatusOther: "Other Civil Status",
  birthday: "Birthday",
  residence: "Residence",
  contactInformation: "Contact Information",
  degreeProgramCompleted: "Degree Program Completed",
  yearGraduated: "Year Graduated",
  yearGraduatedOther: "Other Graduation Year",
  academicHonors: "Academic Honors",
  academicHonorsOtherText: "Other Academic Honor",
  pursuedFurtherStudies: "Pursued Further Studies",
  furtherDegreeProgram: "Further Degree Program",
  furtherStudiesReason: "Reason for Pursuing Advanced Studies",
  furtherStudiesReasonOther: "Other Reason for Pursuing Advanced Studies",
  hasTakenPnle: "Taken PNLE",
  licensureStatus: "Licensure Status",
  pnleYearPassed: "PNLE Year Passed",
  pnleYearPassedOther: "Other PNLE Year",
  examTakeCount: "PNLE Exam Take Count",
  employmentStatus: "Employment Status",
  jobRelatedToDegree: "Job Related to Degree",
  employmentSector: "Employment Sector",
  employmentSectorOther: "Other Employment Sector",
  positionDesignation: "Position / Designation",
  positionDesignationOther: "Other Position / Designation",
  firstJobDuration: "First Job Duration",
  firstJobSources: "How First Job Was Found",
  firstJobSourceOtherText: "Other First Job Source",
  estimatedMonthlySalary: "Estimated Monthly Salary",
  unemploymentReasons: "Reason(s) for Unemployment",
  unemploymentReasonOtherText: "Other Unemployment Reason",
  relevanceSkills: "Relevant Skills from Program",
  careerPreparationLevel: "Career Preparation Level",
  nursingProgramAspect: "Most Helpful Program Aspect",
  nursingProgramSuggestion: "Program Improvement Suggestion",
  invitationChannels: "Preferred Invitation Channels",
  invitationChannelOtherText: "Other Invitation Channel",
  updateFrequency: "Preferred Update Frequency",
  alumniGroupWillingness: "Willingness to Join Alumni Group",
  alumniPlatform: "Preferred Alumni Platform",
  status: "Submission Status",
}

const NESTED_FIELD_LABELS: Record<string, Record<string, string>> = {
  academicHonors: {
    cumLaude: "Cum Laude",
    magnaCumLaude: "Magna Cum Laude",
    summaCumLaude: "Summa Cum Laude",
    none: "None",
    other: "Other",
  },
  firstJobSources: {
    jobFairs: "Job fairs",
    schoolPlacementOffice: "School placement office",
    onlineJobPortal: "Online job portal",
    recommendationFromFriendsRelatives: "Recommendation from friends/relatives",
    walkInApplication: "Walk-in application",
    other: "Other",
  },
  unemploymentReasons: {
    currentlyPursuingFurtherStudies: "Currently pursuing further studies",
    lackOfWorkOpportunities: "Lack of work opportunities",
    familyResponsibility: "Family responsibility",
    healthReasons: "Health reasons",
    waitingForLicensureExam: "Waiting for licensure exam",
    other: "Other",
  },
  relevanceSkills: {
    clinicalSkills: "Clinical skills",
    criticalThinking: "Critical thinking",
    communicationSkills: "Communication skills",
    leadership: "Leadership",
    patientCare: "Patient care",
    teamwork: "Teamwork",
    problemSolving: "Problem solving",
  },
  invitationChannels: {
    email: "Email",
    facebookPageGroup: "Facebook page/group",
    messenger: "Messenger",
    smsTextMessage: "SMS / text message",
    officialSchoolWebsite: "Official school website",
    phoneCall: "Phone call",
    other: "Other",
  },
}

const toReadableLabel = (fieldKey: string) => {
  if (FIELD_LABELS[fieldKey]) {
    return FIELD_LABELS[fieldKey]
  }

  const spaced = fieldKey
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()

  return spaced.length > 0 ? `${spaced.charAt(0).toUpperCase()}${spaced.slice(1)}` : fieldKey
}

const toReadableNestedLabel = (groupKey: string, fieldKey: string) => {
  const nestedLabel = NESTED_FIELD_LABELS[groupKey]?.[fieldKey]
  return nestedLabel ?? toReadableLabel(fieldKey)
}

export const formatPrimitiveValue = (fieldKey: string, value: unknown): string => {
  if (value === null || value === undefined) {
    return "Not provided"
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }

  if (typeof value === "number") {
    return `${value}`
  }

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) {
      return "Not provided"
    }

    if (fieldKey === "birthday") {
      const parsed = Date.parse(trimmed)
      return Number.isNaN(parsed)
        ? trimmed
        : new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date(parsed))
    }

    return trimmed
  }

  return String(value)
}

const formatObjectValue = (groupKey: string, value: Record<string, unknown>) => {
  const entries = Object.entries(value)
  if (entries.length === 0) {
    return "Not provided"
  }

  const allBooleans = entries.every(([, nestedValue]) => typeof nestedValue === "boolean")
  if (allBooleans) {
    const selectedValues = entries
      .filter(([, checked]) => checked === true)
      .map(([nestedKey]) => toReadableNestedLabel(groupKey, nestedKey))

    return selectedValues.length > 0 ? selectedValues.join(", ") : "None selected"
  }

  return entries
    .map(([nestedKey, nestedValue]) => `${toReadableNestedLabel(groupKey, nestedKey)}: ${formatPrimitiveValue(nestedKey, nestedValue)}`)
    .join("\n")
}

export const toResponseLabel = toReadableLabel

export const formatResponseValue = (fieldKey: string, rawValue: unknown) => {
  if (Array.isArray(rawValue)) {
    const values = rawValue
      .map((item) => formatPrimitiveValue(fieldKey, item))
      .filter((item) => item !== "Not provided")

    return values.length > 0 ? values.join(", ") : "Not provided"
  }

  if (rawValue && typeof rawValue === "object") {
    return formatObjectValue(fieldKey, rawValue as Record<string, unknown>)
  }

  return formatPrimitiveValue(fieldKey, rawValue)
}
