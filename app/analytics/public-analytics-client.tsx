"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const DEFAULT_API_BASE_URL = "https://tracer-backend-mkls.onrender.com"

type AnalyticsState = {
  status: "idle" | "loading" | "success" | "error"
  data: unknown
  error: string
}

type SummaryMetric = {
  label: string
  value: number | string
  helper?: string
}

type BreakdownSection = {
  title: string
  entries: Array<{ label: string; value: number }>
}

const getApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
}

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return "Unable to load analytics right now."
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value)

const toTitleCase = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)

const toNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

const extractNumericRecord = (value: unknown): Array<{ label: string; value: number }> => {
  if (!isRecord(value)) {
    return []
  }

  const entries = Object.entries(value)
    .map(([key, entryValue]) => {
      const numberValue = toNumber(entryValue)
      if (numberValue === null) {
        return null
      }
      return { label: toTitleCase(key), value: numberValue }
    })
    .filter((entry): entry is { label: string; value: number } => !!entry)

  return entries.length > 0 ? entries : []
}

const extractTotalResponses = (payload: unknown) => {
  if (Array.isArray(payload)) {
    return payload.length
  }

  if (!isRecord(payload)) {
    return null
  }

  const priorityKeys = [
    "totalResponses",
    "responsesCount",
    "responseCount",
    "totalSubmissions",
    "submissionsCount",
    "total",
    "count",
  ]

  for (const key of priorityKeys) {
    if (key in payload) {
      const value = toNumber(payload[key])
      if (value !== null) {
        return value
      }
    }
  }

  const nestedSources = [payload.meta, payload.summary, payload.data]
  for (const source of nestedSources) {
    if (!isRecord(source)) {
      continue
    }
    for (const key of priorityKeys) {
      if (key in source) {
        const value = toNumber(source[key])
        if (value !== null) {
          return value
        }
      }
    }
  }

  const arrayCandidates = ["responses", "submissions", "items", "data"]
  for (const key of arrayCandidates) {
    if (Array.isArray(payload[key])) {
      return payload[key].length
    }
  }

  if (isRecord(payload.data)) {
    for (const key of arrayCandidates) {
      if (Array.isArray(payload.data[key])) {
        return payload.data[key].length
      }
    }
  }

  return null
}

const buildSummaryMetrics = (payload: unknown) => {
  const metrics: SummaryMetric[] = []
  const seen = new Set<string>()

  const addMetric = (metric: SummaryMetric) => {
    if (!metric.label || seen.has(metric.label)) {
      return
    }
    seen.add(metric.label)
    metrics.push(metric)
  }

  const totalResponses = extractTotalResponses(payload)
  if (totalResponses !== null) {
    addMetric({ label: "Total responses", value: totalResponses })
  }

  if (!isRecord(payload)) {
    return metrics
  }

  const sources: Array<[string, unknown]> = Object.entries(payload)
  if (isRecord(payload.data)) {
    sources.push(...Object.entries(payload.data))
  }

  for (const [key, value] of sources) {
    if (Array.isArray(value)) {
      addMetric({ label: `Total ${toTitleCase(key)}`, value: value.length })
    }
  }

  return metrics
}

const buildBreakdownSections = (payload: unknown) => {
  if (!isRecord(payload)) {
    return [] as BreakdownSection[]
  }

  const sections: BreakdownSection[] = []
  const sources: Array<[string, unknown]> = Object.entries(payload)
  if (isRecord(payload.data)) {
    sources.push(...Object.entries(payload.data))
  }

  for (const [key, value] of sources) {
    const numericEntries = extractNumericRecord(value)
    if (numericEntries.length > 0) {
      sections.push({ title: toTitleCase(key), entries: numericEntries })
    }
  }

  return sections
}

export default function PublicAnalyticsClient() {
  const searchParams = useSearchParams()
  const [state, setState] = useState<AnalyticsState>({
    status: "idle",
    data: null,
    error: "",
  })

  const tokenFromQuery = searchParams.get("token") ?? ""
  const fallbackToken = process.env.NEXT_PUBLIC_PUBLIC_ANALYTICS_TOKEN ?? ""
  const token = tokenFromQuery || fallbackToken

  const analyticsQuery = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (token) {
      params.set("token", token)
    } else {
      params.delete("token")
    }
    return params.toString()
  }, [searchParams, token])

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setState({ status: "error", data: null, error: "Missing analytics token." })
        return
      }

      setState((prev) => ({ ...prev, status: "loading", error: "" }))

      try {
        const response = await fetch(
          `${getApiBaseUrl()}/api/v1/public/analytics?${analyticsQuery}`,
          { cache: "no-store" },
        )

        if (!response.ok) {
          throw new Error("Unable to load analytics data.")
        }

        const payload = (await response.json()) as unknown
        setState({ status: "success", data: payload, error: "" })
      } catch (error) {
        setState({ status: "error", data: null, error: toErrorMessage(error) })
      }
    }

    void run()
  }, [analyticsQuery, token])

  const summaryMetrics = useMemo(
    () => (state.status === "success" ? buildSummaryMetrics(state.data) : []),
    [state.status, state.data],
  )

  const breakdownSections = useMemo(
    () => (state.status === "success" ? buildBreakdownSections(state.data) : []),
    [state.status, state.data],
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <div className="rounded-lg border border-maroon/20 p-5 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-maroon">Alumni Tracer Survey</p>
            <h1 className="text-3xl font-bold text-maroon">Public Analytics</h1>
            <p className="text-foreground leading-relaxed">
              This view is powered by the public analytics API. If you received this link from an admin, the data is already filtered.
            </p>
          </div>

          <Card className="border-maroon/20">
            <CardHeader>
              <CardTitle>Analytics data</CardTitle>
              <CardDescription>
                JSON payload returned by the public analytics endpoint.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state.status === "loading" && (
                <p className="text-sm text-muted-foreground">Loading analytics...</p>
              )}
              {state.status === "error" && (
                <p className="text-sm text-maroon">{state.error}</p>
              )}
              {state.status === "success" && summaryMetrics.length > 0 && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {summaryMetrics.map((metric) => (
                      <Card key={metric.label} className="border-maroon/10 shadow-sm">
                        <CardHeader className="pb-2">
                          <CardDescription>{metric.label}</CardDescription>
                          <CardTitle className="text-2xl text-maroon">
                            {metric.value}
                          </CardTitle>
                        </CardHeader>
                        {metric.helper ? (
                          <CardContent className="pt-0 text-xs text-muted-foreground">
                            {metric.helper}
                          </CardContent>
                        ) : null}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              {state.status === "success" && summaryMetrics.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Analytics loaded. No summary fields were detected in the payload.
                </p>
              )}
              {state.status === "success" && breakdownSections.length > 0 && (
                <div className="space-y-4">
                  {breakdownSections.map((section) => (
                    <Card key={section.title} className="border-maroon/10">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-maroon">
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {section.entries.map((entry) => (
                            <div
                              key={entry.label}
                              className="flex items-center justify-between rounded-md border border-muted/70 bg-muted/50 px-3 py-2 text-sm"
                            >
                              <span className="font-medium text-foreground">{entry.label}</span>
                              <span className="text-maroon font-semibold">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
