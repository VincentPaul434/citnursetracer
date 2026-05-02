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

const isPlainObjectArray = (value: unknown): value is Array<Record<string, unknown>> =>
  Array.isArray(value) && value.every((entry) => isRecord(entry))

const extractResponseArray = (payload: unknown) => {
  if (isPlainObjectArray(payload)) {
    return payload
  }

  if (!isRecord(payload)) {
    return null
  }

  const candidateKeys = ["responses", "submissions", "items", "data", "rows"]
  for (const key of candidateKeys) {
    if (isPlainObjectArray(payload[key])) {
      return payload[key]
    }
  }

  if (isRecord(payload.data)) {
    for (const key of candidateKeys) {
      if (isPlainObjectArray(payload.data[key])) {
        return payload.data[key]
      }
    }
  }

  return null
}

const MAX_VALUE_LENGTH = 40

const normalizeValue = (value: unknown) => {
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed || trimmed.length > MAX_VALUE_LENGTH) {
      return null
    }
    return trimmed
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }

  return null
}

const collectCategoricalBreakdowns = (payload: unknown) => {
  const responses = extractResponseArray(payload)
  if (!responses || responses.length === 0) {
    return [] as BreakdownSection[]
  }

  const counters = new Map<string, Map<string, number>>()

  responses.forEach((response) => {
    Object.entries(response).forEach(([rawKey, rawValue]) => {
      if (rawValue === null || rawValue === undefined) {
        return
      }

      const values: string[] = []

      if (Array.isArray(rawValue)) {
        rawValue.forEach((item) => {
          const normalized = normalizeValue(item)
          if (normalized) {
            values.push(normalized)
          }
        })
      } else {
        const normalized = normalizeValue(rawValue)
        if (normalized) {
          values.push(normalized)
        }
      }

      if (values.length === 0) {
        return
      }

      const key = toTitleCase(rawKey)
      if (!counters.has(key)) {
        counters.set(key, new Map())
      }
      const bucket = counters.get(key)!
      values.forEach((value) => {
        bucket.set(value, (bucket.get(value) ?? 0) + 1)
      })
    })
  })

  const sections: BreakdownSection[] = []
  counters.forEach((valueMap, title) => {
    const entries = Array.from(valueMap.entries())
      .map(([label, count]) => ({ label, value: count }))
      .sort((a, b) => b.value - a.value)

    if (entries.length > 0) {
      sections.push({ title, entries })
    }
  })

  return sections.sort((a, b) => a.title.localeCompare(b.title))
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

  const categoricalBreakdowns = useMemo(
    () => (state.status === "success" ? collectCategoricalBreakdowns(state.data) : []),
    [state.status, state.data],
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div className="rounded-lg border border-maroon/20 bg-white/60 p-5 backdrop-blur">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-maroon">Alumni Tracer Survey</p>
                <h1 className="text-3xl font-bold text-maroon">Public Analytics Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Summary snapshots from the public analytics API.
                </p>
              </div>
              <div className="rounded-full border border-maroon/20 bg-maroon/5 px-4 py-2 text-xs font-semibold text-maroon">
                Updated on load
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[240px,1fr]">
            <Card className="border-maroon/15">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-maroon">Filters</CardTitle>
                <CardDescription>Auto-applied by the shared link.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Year</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {"2024,2023,2022".split(",").map((year) => (
                      <span
                        key={year}
                        className="rounded-full border border-muted/70 bg-muted/40 px-3 py-1 text-xs"
                      >
                        {year}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Program</p>
                  <div className="mt-2 space-y-2">
                    {["BS Nursing", "BS Midwifery", "BS Public Health"].map((program) => (
                      <div key={program} className="rounded-md border border-muted/70 px-3 py-2 text-xs">
                        {program}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Filters are pre-selected by admins for each shared link.
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {state.status === "success" && summaryMetrics.length > 0
                  ? summaryMetrics.map((metric) => (
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
                    ))
                  : Array.from({ length: 4 }).map((_, index) => (
                      <Card key={`placeholder-${index}`} className="border-dashed border-muted/60">
                        <CardHeader className="pb-2">
                          <CardDescription>
                            {state.status === "loading" ? "Loading" : "Metric"}
                          </CardDescription>
                          <CardTitle className="text-2xl text-muted-foreground">
                            {state.status === "loading" ? "..." : "--"}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    ))}
              </div>

              <Card className="border-maroon/15">
                <CardHeader>
                  <CardTitle className="text-base text-maroon">Summary Notes</CardTitle>
                  <CardDescription>
                    Counts represent the latest response totals available in the public analytics API.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {state.status === "loading" && (
                    <p className="text-sm text-muted-foreground">Loading analytics...</p>
                  )}
                  {state.status === "error" && (
                    <p className="text-sm text-maroon">{state.error}</p>
                  )}
                  {state.status === "success" && summaryMetrics.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Analytics loaded. No summary fields were detected in the payload.
                    </p>
                  )}
                  {state.status === "success" && summaryMetrics.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Use the shared link filters to focus on specific cohorts.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-maroon/15">
                <CardHeader>
                  <CardTitle className="text-base text-maroon">Categorical Breakdown</CardTitle>
                  <CardDescription>
                    Short-form answers only (radio, dropdown, checkbox). Long text responses are hidden.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.status === "loading" && (
                    <p className="text-sm text-muted-foreground">Loading breakdowns...</p>
                  )}
                  {state.status === "error" && (
                    <p className="text-sm text-maroon">{state.error}</p>
                  )}
                  {state.status === "success" && categoricalBreakdowns.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No short-form fields were detected in the payload.
                    </p>
                  )}
                  {state.status === "success" && categoricalBreakdowns.length > 0 && (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {categoricalBreakdowns.map((section) => (
                        <div key={section.title} className="rounded-md border border-muted/60 p-3">
                          <p className="text-sm font-semibold text-foreground">{section.title}</p>
                          <div className="mt-2 space-y-2">
                            {section.entries.map((entry) => (
                              <div
                                key={`${section.title}-${entry.label}`}
                                className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-xs"
                              >
                                <span className="font-medium text-foreground">{entry.label}</span>
                                <span className="text-maroon font-semibold">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
