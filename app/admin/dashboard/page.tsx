import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ADMIN_SESSION_COOKIE, buildAdminApiUrl, parseAdminSession } from "@/lib/admin-auth"

interface SurveyResponseRow {
  email: string
  status: string
  submittedAt: string
  createdAt: string
  updatedAt: string
  details: Record<string, unknown>
}

interface ReadableDetailRow {
  key: string
  label: string
  value: string
}

const SURVEY_RESPONSES_ENDPOINT = "/api/v1/admin/survey-responses?page=0&size=100&sort=submittedAt,desc"

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
  submittedAt: "Submitted At",
  createdAt: "Created At",
  updatedAt: "Updated At",
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

const DETAIL_FIELD_ORDER = [
  "email",
  "status",
  "submittedAt",
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
  "academicHonors",
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
  "firstJobSources",
  "firstJobSourceOtherText",
  "estimatedMonthlySalary",
  "unemploymentReasons",
  "unemploymentReasonOtherText",
  "relevanceSkills",
  "careerPreparationLevel",
  "nursingProgramAspect",
  "nursingProgramSuggestion",
  "invitationChannels",
  "invitationChannelOtherText",
  "updateFrequency",
  "alumniGroupWillingness",
  "alumniPlatform",
  "createdAt",
  "updatedAt",
]

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

const formatDateTime = (value: string) => {
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) {
    return value
  }

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(parsed))
}

const formatPrimitiveValue = (fieldKey: string, value: unknown): string => {
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

    if (fieldKey === "submittedAt" || fieldKey === "createdAt" || fieldKey === "updatedAt" || fieldKey === "birthday") {
      return formatDateTime(trimmed)
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

const buildReadableDetailRows = (details: Record<string, unknown>): ReadableDetailRow[] => {
  const rows = Object.entries(details)
    .filter(([fieldKey]) => fieldKey !== "details")
    .map(([fieldKey, rawValue]) => {
      if (Array.isArray(rawValue)) {
        const values = rawValue
          .map((item) => formatPrimitiveValue(fieldKey, item))
          .filter((item) => item !== "Not provided")

        return {
          key: fieldKey,
          label: toReadableLabel(fieldKey),
          value: values.length > 0 ? values.join(", ") : "Not provided",
        }
      }

      if (rawValue && typeof rawValue === "object") {
        return {
          key: fieldKey,
          label: toReadableLabel(fieldKey),
          value: formatObjectValue(fieldKey, rawValue as Record<string, unknown>),
        }
      }

      return {
        key: fieldKey,
        label: toReadableLabel(fieldKey),
        value: formatPrimitiveValue(fieldKey, rawValue),
      }
    })
    .filter((row) => row.value !== "Not provided")

  rows.sort((rowA, rowB) => {
    const indexA = DETAIL_FIELD_ORDER.indexOf(rowA.key)
    const indexB = DETAIL_FIELD_ORDER.indexOf(rowB.key)

    const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA
    const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB

    if (safeIndexA !== safeIndexB) {
      return safeIndexA - safeIndexB
    }

    return rowA.label.localeCompare(rowB.label)
  })

  return rows
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const session = parseAdminSession(sessionValue)

  if (!session) {
    redirect("/admin/login")
  }

  const surveyResponseRequest = await fetch(buildAdminApiUrl(SURVEY_RESPONSES_ENDPOINT), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: session.authHeader,
    },
    cache: "no-store",
  })

  if (surveyResponseRequest.status === 401 || surveyResponseRequest.status === 403) {
    redirect("/admin/login")
  }

  let surveyResponses: SurveyResponseRow[] = []
  let totalResponses = 0

  if (surveyResponseRequest.ok) {
    const payload = (await surveyResponseRequest.json()) as {
      content?: unknown
      totalElements?: unknown
    }

    if (Array.isArray(payload.content)) {
      surveyResponses = payload.content
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
        .map((item) => ({
          email: typeof item.email === "string" && item.email.trim().length > 0 ? item.email : "-",
          status: typeof item.status === "string" && item.status.trim().length > 0 ? item.status : "N/A",
          submittedAt:
            typeof item.submittedAt === "string" && item.submittedAt.trim().length > 0 ? item.submittedAt : "-",
          createdAt: typeof item.createdAt === "string" && item.createdAt.trim().length > 0 ? item.createdAt : "-",
          updatedAt: typeof item.updatedAt === "string" && item.updatedAt.trim().length > 0 ? item.updatedAt : "-",
          details: item,
        }))
    }

    totalResponses = typeof payload.totalElements === "number" ? payload.totalElements : surveyResponses.length
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-maroon text-gold p-4 flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          <Image src="/download.png" alt="CIT-U Logo" width={48} height={48} className="h-12 w-12 object-contain" priority />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">CEBU INSTITUTE OF TECHNOLOGY</h1>
          <p className="text-sm font-semibold">UNIVERSITY</p>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div className="rounded-lg border border-maroon/20 p-5 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-maroon">Alumni Tracer Survey</p>
            <h2 className="text-3xl font-bold text-maroon">Admin Dashboard</h2>
            <p className="text-foreground leading-relaxed">
              Review submitted alumni tracer responses in one place for reporting and monitoring.
            </p>
          </div>

          <Card className="border-maroon/20">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <CardTitle>Survey Responses</CardTitle>
              <CardDescription>
                Showing {surveyResponses.length} response{surveyResponses.length === 1 ? "" : "s"}
                {totalResponses > surveyResponses.length ? ` out of ${totalResponses}` : ""}.
              </CardDescription>
            </div>

            <form action="/admin/logout" method="post">
              <Button type="submit" variant="outline">
                Log out
              </Button>
            </form>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveyResponses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      No survey responses found.
                    </TableCell>
                  </TableRow>
                ) : (
                  surveyResponses.map((surveyResponse, index) => {
                    const readableDetailRows = buildReadableDetailRows(surveyResponse.details)

                    return (
                      <TableRow key={`${surveyResponse.email}-${surveyResponse.submittedAt}-${index}`}>
                        <TableCell className="max-w-60 truncate">{surveyResponse.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              surveyResponse.status.toLowerCase() === "submitted"
                                ? "default"
                                : surveyResponse.status.toLowerCase() === "pending"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {surveyResponse.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDateTime(surveyResponse.submittedAt)}</TableCell>
                        <TableCell>{formatDateTime(surveyResponse.createdAt)}</TableCell>
                        <TableCell>{formatDateTime(surveyResponse.updatedAt)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button type="button" size="sm" variant="outline">
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Survey Response Summary</DialogTitle>
                                <DialogDescription>
                                  Easy-to-read answers submitted by {surveyResponse.email}.
                                </DialogDescription>
                              </DialogHeader>

                              {readableDetailRows.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No response details available.</p>
                              ) : (
                                <div className="space-y-3">
                                  {readableDetailRows.map((row) => (
                                    <div key={row.key} className="rounded-md border p-3">
                                      <p className="text-xs font-medium text-muted-foreground">{row.label}</p>
                                      <p className="mt-1 text-sm whitespace-pre-wrap wrap-break-word">{row.value}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
