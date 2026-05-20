import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BatchFilterTable from "@/components/admin/dashboard/batch-filter-table"
import AdminShellHeader from "@/components/admin/dashboard/admin-shell-header"
import type { SurveyResponseRow } from "@/components/admin/dashboard/types"
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SURVEY_RESPONSES_CACHE_TAG,
  buildAdminApiUrl,
  parseAdminSession,
} from "@/lib/admin-auth"
import { ArrowUpRight, CheckCircle2, TrendingUp, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Dashboard - CIT Nursing Graduate Tracer",
  description: "Review nursing graduate survey responses and analytics.",
}

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
      cache: "force-cache",
      next: {
        tags: [ADMIN_SURVEY_RESPONSES_CACHE_TAG],
      },
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

  const stats = [
    {
      label: "Total Responses",
      value: String(totalResponses),
      caption: totalResponses === 1 ? "alumni response" : "alumni responses",
      icon: Users,
    },
    {
      label: "PNLE Passing Rate",
      value: pnlePassingRate,
      caption: "based on submitted licensure data",
      icon: CheckCircle2,
    },
    {
      label: "Employment Rate",
      value: employmentRate.rate,
      caption: employmentRate.detail,
      icon: TrendingUp,
    },
  ] as const

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--gold)_18%,transparent),transparent_70%)]"
      />

      <AdminShellHeader username="Admin" />

      <div className="flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto w-full max-w-7xl space-y-6 animate-fade-up">
          <div className="relative overflow-hidden rounded-2xl border border-maroon/15 bg-gradient-to-br from-white via-gold/10 to-white p-6 shadow-sm md:p-7">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-maroon/10 blur-2xl" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-maroon">Alumni Tracer Survey</p>
                <h2 className="text-3xl font-bold tracking-tight text-maroon md:text-4xl text-balance">Admin Dashboard</h2>
                <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
                  Review alumni responses with clean sections for faster reading and share analytics with stakeholders in one click.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-maroon text-gold hover:bg-maroon/90 font-semibold">
                  <Link href="/admin/analytics">
                    Share Analytics
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card
                  key={stat.label}
                  className="group relative overflow-hidden border-maroon/15 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-maroon/25 hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold/15 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                  <CardHeader className="relative space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-maroon/8 ring-1 ring-maroon/15 transition-colors group-hover:bg-maroon/12">
                        <Icon className="h-5 w-5 text-maroon" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <CardDescription className="text-xs font-semibold uppercase tracking-wider">{stat.label}</CardDescription>
                      <CardTitle className="text-3xl font-black leading-none tracking-tight text-maroon tabular-nums">
                        {stat.value}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{stat.caption}</p>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>

          <Card className="border-maroon/15 shadow-sm">
            <CardHeader className="flex flex-col gap-4 border-b border-border/50 pb-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl text-maroon">Survey Responses</CardTitle>
                <CardDescription>
                  Showing {surveyResponses.length} response
                  {surveyResponses.length === 1 ? "" : "s"}
                  {totalResponses > surveyResponses.length ? ` out of ${totalResponses}` : ""}
                  .
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <BatchFilterTable responses={surveyResponses} initialTotalCount={totalResponses} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
