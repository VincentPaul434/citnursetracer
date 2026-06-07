"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import BatchFilterTable from "@/components/admin/dashboard/batch-filter-table"
import type { SurveyResponseRow } from "@/components/admin/dashboard/types"
import { BarChart3 } from "lucide-react"

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
      label: "Total responses",
      value: String(totalResponses),
      caption: totalResponses === 1 ? "alumni response" : "alumni responses",
    },
    {
      label: "PNLE passing rate",
      value: pnlePassingRate,
      caption: "of submitted licensure data",
    },
    {
      label: "Employment rate",
      value: employmentRate.rate,
      caption: employmentRate.detail,
    },
  ] as const

  return (
    <div className="flex-1 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Survey Responses</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {query.isLoading
                ? "Loading responses…"
                : query.isError
                  ? "Unable to load responses."
                  : `${totalResponses} alumni response${totalResponses === 1 ? "" : "s"}`}
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-md bg-maroon text-white hover:bg-maroon/90"
          >
            <Link href="/admin/analytics">
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 divide-y divide-border rounded-md border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="p-4">
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="mt-1.5 text-2xl font-semibold tabular-nums text-foreground">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{stat.caption}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-border bg-card p-4 md:p-5">
          <BatchFilterTable responses={surveyResponses} initialTotalCount={totalResponses} />
        </div>
      </div>
    </div>
  )
}
