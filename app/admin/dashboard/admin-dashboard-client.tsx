"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BatchFilterTable from "@/components/admin/dashboard/batch-filter-table"
import type { SurveyResponseRow } from "@/components/admin/dashboard/types"
import { ArrowUpRight, CheckCircle2, TrendingUp, Users } from "lucide-react"

const ADMIN_DASHBOARD_ENDPOINT =
  "/api/admin/survey-responses?page=0&size=100&sort=submittedAt,desc"

type AdminSurveyResponsesPayload = {
  content?: SurveyResponseRow[]
  totalElements?: number
}

const fetchAdminSurveyResponses = async (): Promise<AdminSurveyResponsesPayload> => {
  const response = await fetch(ADMIN_DASHBOARD_ENDPOINT, {
    method: "GET",
    headers: { Accept: "application/json" },
  })

  if (response.status === 401 || response.status === 403) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login"
    }
    throw new Error("Unauthorized")
  }

  if (!response.ok) {
    throw new Error("Failed to load survey responses")
  }

  return (await response.json()) as AdminSurveyResponsesPayload
}

const toEmploymentRate = (responses: SurveyResponseRow[]) => {
  const withEmploymentStatus = responses.filter(
    (response) => response.employmentStatus !== "N/A",
  )

  if (withEmploymentStatus.length === 0) {
    return { rate: "N/A", detail: "No employment data available" }
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

export default function AdminDashboardClient() {
  const query = useQuery({
    queryKey: ["admin-survey-responses", { page: 0, size: 100, sort: "submittedAt,desc" }],
    queryFn: fetchAdminSurveyResponses,
    staleTime: 60_000,
  })

  const surveyResponses = useMemo(
    () => (Array.isArray(query.data?.content) ? query.data!.content : []),
    [query.data],
  )

  const totalResponses =
    typeof query.data?.totalElements === "number"
      ? query.data.totalElements
      : surveyResponses.length

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
                {query.isLoading
                  ? "Loading responses..."
                  : query.isError
                    ? "Unable to load responses."
                    : (
                        <>
                          Showing {surveyResponses.length} response
                          {surveyResponses.length === 1 ? "" : "s"}
                          {totalResponses > surveyResponses.length ? ` out of ${totalResponses}` : ""}
                          .
                        </>
                      )}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <BatchFilterTable responses={surveyResponses} initialTotalCount={totalResponses} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
