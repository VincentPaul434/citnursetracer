import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ResponsesTable from "@/components/admin/dashboard/responses-table"
import type { SurveyResponseRow } from "@/components/admin/dashboard/types"
import {
  ADMIN_SESSION_COOKIE,
  buildAdminApiUrl,
  parseAdminSession,
} from "@/lib/admin-auth"
import { CheckCircle2, TrendingUp, Users } from "lucide-react"

const SURVEY_RESPONSES_ENDPOINT =
  "/api/v1/admin/survey-responses?page=0&size=100&sort=submittedAt,desc"

const toStringValue = (value: unknown, fallback = "N/A") => {
  if (typeof value !== "string") {
    return fallback
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

const getNestedObjectCandidates = (item: Record<string, unknown>) => {
  return Object.values(item).filter(
    (value): value is Record<string, unknown> =>
      typeof value === "object" && value !== null && !Array.isArray(value),
  )
}

const getStringField = (
  item: Record<string, unknown>,
  field: string,
  fallback = "N/A",
) => {
  const topLevel = toStringValue(item[field], "")
  if (topLevel !== "") {
    return topLevel
  }

  const nestedCandidates = getNestedObjectCandidates(item)
  for (const candidate of nestedCandidates) {
    const nestedValue = toStringValue(candidate[field], "")
    if (nestedValue !== "") {
      return nestedValue
    }
  }

  return fallback
}

const mapResponseRows = (payloadContent: unknown): SurveyResponseRow[] => {
  if (!Array.isArray(payloadContent)) {
    return []
  }

  return payloadContent
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    )
    .map((item) => ({
      email: getStringField(item, "email", "-"),
      status: getStringField(item, "status"),
      employmentStatus: getStringField(item, "employmentStatus"),
      licensureStatus: getStringField(item, "licensureStatus"),
      details: item,
    }))
}

const toEmploymentRate = (responses: SurveyResponseRow[]) => {
  const withEmploymentStatus = responses.filter(
    (response) => response.employmentStatus !== "N/A",
  )

  if (withEmploymentStatus.length === 0) {
    return {
      rate: "N/A",
      detail: "No employment data available",
    }
  }

  const employedCount = withEmploymentStatus.filter((response) => {
    const value = response.employmentStatus.toLowerCase()
    return value.includes("employed") && !value.includes("unemployed")
  }).length

  const rate = Math.round((employedCount / withEmploymentStatus.length) * 100)

  return {
    rate: `${rate}%`,
    detail: `${employedCount}/${withEmploymentStatus.length} employed`,
  }
}

const toPnlePassingRate = (responses: SurveyResponseRow[]) => {
  const withLicensureStatus = responses.filter(
    (response) => response.licensureStatus !== "N/A",
  )

  if (withLicensureStatus.length === 0) {
    return "N/A"
  }

  const passedCount = withLicensureStatus.filter((response) =>
    response.licensureStatus.toLowerCase().includes("pass"),
  ).length

  const percentage = Math.round((passedCount / withLicensureStatus.length) * 100)
  return `${percentage}% (${passedCount}/${withLicensureStatus.length})`
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const session = parseAdminSession(sessionValue)

  if (!session) {
    redirect("/admin/login")
  }

  const surveyResponseRequest = await fetch(
    buildAdminApiUrl(SURVEY_RESPONSES_ENDPOINT),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: session.authHeader,
      },
      cache: "no-store",
    },
  )

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

    surveyResponses = mapResponseRows(payload.content)
    totalResponses =
      typeof payload.totalElements === "number"
        ? payload.totalElements
        : surveyResponses.length
  }

  const pnlePassingRate = toPnlePassingRate(surveyResponses)
  const employmentRate = toEmploymentRate(surveyResponses)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-maroon text-gold p-4 flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          <Image
            src="/download.png"
            alt="CIT-U Logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            priority
          />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">CEBU INSTITUTE OF TECHNOLOGY</h1>
          <p className="text-sm font-semibold">UNIVERSITY</p>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div className="rounded-lg border border-maroon/20 p-5 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-maroon">
              Alumni Tracer Survey
            </p>
            <h2 className="text-3xl font-bold text-maroon">Admin Dashboard</h2>
            <p className="text-foreground leading-relaxed">
              Review alumni responses with clean sections for faster reading.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-maroon/20">
              <CardHeader className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <Users className="h-5 w-5 text-maroon" />
                </div>
                <div className="space-y-1">
                  <CardDescription>Total Responses</CardDescription>
                  <CardTitle className="text-3xl leading-none">{totalResponses}</CardTitle>
                </div>
              </CardHeader>
            </Card>
            <Card className="border-maroon/20">
              <CardHeader className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <CheckCircle2 className="h-5 w-5 text-maroon" />
                </div>
                <div className="space-y-1">
                  <CardDescription>PNLE Passing Rate</CardDescription>
                  <CardTitle className="text-3xl leading-none">{pnlePassingRate}</CardTitle>
                </div>
              </CardHeader>
            </Card>
            <Card className="border-maroon/20">
              <CardHeader className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <TrendingUp className="h-5 w-5 text-maroon" />
                </div>
                <div className="space-y-1">
                  <CardDescription>Employment Rate</CardDescription>
                  <div className="flex items-end gap-2">
                    <CardTitle className="text-3xl leading-none">{employmentRate.rate}</CardTitle>
                    <span className="text-sm font-medium text-muted-foreground">{employmentRate.detail}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <Card className="border-maroon/20">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <CardTitle>Survey Responses</CardTitle>
                <CardDescription>
                  Showing {surveyResponses.length} response
                  {surveyResponses.length === 1 ? "" : "s"}
                  {totalResponses > surveyResponses.length
                    ? ` out of ${totalResponses}`
                    : ""}
                  .
                </CardDescription>
              </div>

              <form action="/admin/logout" method="post">
                <Button type="submit" variant="outline">
                  Log out
                </Button>
              </form>
            </CardHeader>

            <CardContent>
              <ResponsesTable responses={surveyResponses} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
