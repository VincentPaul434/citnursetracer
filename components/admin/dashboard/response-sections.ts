import { formatResponseValue, toResponseLabel } from "./response-formatters"
import type { ResponseDetailRow, ResponseSection } from "./types"

interface SectionDefinition {
  key: string
  title: string
  fields: string[]
}

const getNestedObjectCandidates = (details: Record<string, unknown>) =>
  Object.values(details).filter(
    (value): value is Record<string, unknown> =>
      typeof value === "object" && value !== null && !Array.isArray(value),
  )

const getFieldValue = (details: Record<string, unknown>, field: string) => {
  if (field in details) {
    return details[field]
  }

  for (const candidate of getNestedObjectCandidates(details)) {
    if (field in candidate) {
      return candidate[field]
    }
  }

  return undefined
}

const getFieldText = (details: Record<string, unknown>, field: string) => {
  const value = getFieldValue(details, field)
  if (typeof value !== "string") {
    return ""
  }

  return value.trim().toLowerCase()
}

const isYesAnswer = (details: Record<string, unknown>, field: string) => {
  const value = getFieldValue(details, field)
  if (typeof value === "boolean") {
    return value
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    return normalized === "yes" || normalized === "true"
  }

  return false
}

const includesOther = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.some(
      (item) => typeof item === "string" && item.trim().toLowerCase().includes("other"),
    )
  }

  if (typeof value === "string") {
    return value.trim().toLowerCase().includes("other")
  }

  if (value && typeof value === "object") {
    const recordValue = value as Record<string, unknown>
    if (recordValue.other === true) {
      return true
    }

    return false
  }

  return false
}

const isUnemployed = (details: Record<string, unknown>) => {
  const employmentStatus = getFieldText(details, "employmentStatus")
  return employmentStatus.includes("unemployed")
}

const isFieldRelevant = (details: Record<string, unknown>, field: string) => {
  switch (field) {
    case "genderOther":
      return getFieldText(details, "gender") === "other"
    case "civilStatusOther":
      return getFieldText(details, "civilStatus") === "other"
    case "yearGraduatedOther":
      return getFieldText(details, "yearGraduated").includes("other")
    case "academicHonorsOtherText":
      return includesOther(getFieldValue(details, "academicHonors"))
    case "furtherDegreeProgram":
    case "furtherStudiesReason":
    case "furtherStudiesReasonOther":
      return isYesAnswer(details, "pursuedFurtherStudies")
    case "licensureStatus":
    case "pnleYearPassed":
    case "examTakeCount":
      return isYesAnswer(details, "hasTakenPnle")
    case "pnleYearPassedOther":
      return (
        isYesAnswer(details, "hasTakenPnle") &&
        getFieldText(details, "pnleYearPassed").includes("other")
      )
    case "jobRelatedToDegree":
    case "employmentSector":
    case "positionDesignation":
    case "firstJobDuration":
    case "firstJobSources":
    case "estimatedMonthlySalary":
      return !isUnemployed(details)
    case "employmentSectorOther":
      return (
        !isUnemployed(details) &&
        includesOther(getFieldValue(details, "employmentSector"))
      )
    case "positionDesignationOther":
      return (
        !isUnemployed(details) &&
        includesOther(getFieldValue(details, "positionDesignation"))
      )
    case "firstJobSourceOtherText":
      return (
        !isUnemployed(details) &&
        includesOther(getFieldValue(details, "firstJobSources"))
      )
    case "unemploymentReasons":
      return isUnemployed(details)
    case "unemploymentReasonOtherText":
      return (
        isUnemployed(details) &&
        includesOther(getFieldValue(details, "unemploymentReasons"))
      )
    case "invitationChannelOtherText":
      return includesOther(getFieldValue(details, "invitationChannels"))
    default:
      return true
  }
}

const SECTION_DEFINITIONS: SectionDefinition[] = [
  {
    key: "submission",
    title: "Submission Overview",
    fields: ["email", "status", "consent"],
  },
  {
    key: "personal",
    title: "Personal Information",
    fields: ["fullName", "gender", "genderOther", "civilStatus", "civilStatusOther", "birthday", "residence", "contactInformation"],
  },
  {
    key: "education",
    title: "Educational Background",
    fields: ["degreeProgramCompleted", "yearGraduated", "yearGraduatedOther", "academicHonors", "academicHonorsOtherText", "pursuedFurtherStudies", "furtherDegreeProgram", "furtherStudiesReason", "furtherStudiesReasonOther"],
  },
  {
    key: "licensure",
    title: "Licensure Examination",
    fields: ["hasTakenPnle", "licensureStatus", "pnleYearPassed", "pnleYearPassedOther", "examTakeCount"],
  },
  {
    key: "employment",
    title: "Employment Information",
    fields: ["employmentStatus", "jobRelatedToDegree", "employmentSector", "employmentSectorOther", "positionDesignation", "positionDesignationOther", "firstJobDuration", "firstJobSources", "firstJobSourceOtherText", "estimatedMonthlySalary"],
  },
  {
    key: "unemployment",
    title: "Unemployment Information",
    fields: ["unemploymentReasons", "unemploymentReasonOtherText"],
  },
  {
    key: "educationRelevance",
    title: "Relevance of Education",
    fields: ["relevanceSkills", "careerPreparationLevel"],
  },
  {
    key: "programEvaluation",
    title: "Program Evaluation",
    fields: ["nursingProgramAspect", "nursingProgramSuggestion"],
  },
  {
    key: "communication",
    title: "Communication & Alumni Events",
    fields: ["invitationChannels", "invitationChannelOtherText", "updateFrequency", "alumniGroupWillingness", "alumniPlatform"],
  },
]

const buildRow = (field: string, details: Record<string, unknown>): ResponseDetailRow | null => {
  if (!isFieldRelevant(details, field)) {
    return null
  }

  const fieldValue = getFieldValue(details, field)
  if (fieldValue === undefined) {
    return null
  }

  const value = formatResponseValue(field, fieldValue)
  if (value === "Not provided") {
    return null
  }

  return {
    key: field,
    label: toResponseLabel(field),
    value,
  }
}

export const buildResponseSections = (details: Record<string, unknown>): ResponseSection[] => {
  const usedFields = new Set<string>()

  const sections = SECTION_DEFINITIONS.map((section) => {
    const rows = section.fields
      .map((field) => {
        const row = buildRow(field, details)
        if (row) {
          usedFields.add(field)
        }

        return row
      })
      .filter((row): row is ResponseDetailRow => row !== null)

    return {
      key: section.key,
      title: section.title,
      rows,
    }
  }).filter((section) => section.rows.length > 0)

  const extraRows = Object.entries(details)
    .filter(([field]) => field !== "details" && !usedFields.has(field) && !["submittedAt", "createdAt", "updatedAt"].includes(field))
    .map(([field, value]) => ({
      key: field,
      label: toResponseLabel(field),
      value: formatResponseValue(field, value),
    }))
    .filter((row) => row.value !== "Not provided")

  if (extraRows.length > 0) {
    sections.push({
      key: "other",
      title: "Other Responses",
      rows: extraRows,
    })
  }

  return sections
}
