"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { Briefcase, CheckCircle2, FileText, ClipboardList, Users } from "lucide-react"

const DEFAULT_API_BASE_URL = "https://tracer-backend-mkls.onrender.com"
const ANALYTICS_STALE_TIME = 5 * 60 * 1000

type AnalyticsStatus = "loading" | "success" | "error"

type SummaryMetric = {
  label: string
  value: number | string
  helper?: string
  sparkline?: Array<{ label: string; value: number }>
}

type BreakdownSection = {
  title: string
  entries: Array<{ label: string; value: number }>
}

type CountMap = Record<string, number>

type ChartPoint = {
  label: string
  value: number
}

type PiePoint = ChartPoint & {
  fill: string
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

const toKey = (value: string) => value.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")

const sumCountMap = (map: CountMap) =>
  Object.values(map).reduce((total, value) => total + value, 0)

const extractCountMap = (
  payload: unknown,
  key: string,
  options?: { maxLabelLength?: number },
) => {
  if (!isRecord(payload)) {
    return null
  }

  const source = isRecord(payload[key])
    ? payload[key]
    : isRecord(payload.data) && isRecord(payload.data[key])
      ? payload.data[key]
      : null

  if (!source) {
    return null
  }

  const maxLabelLength = options?.maxLabelLength ?? Infinity
  const entries = Object.entries(source)
    .map(([label, value]) => ({ label, value: toNumber(value) }))
    .filter((entry): entry is { label: string; value: number } => entry.value !== null)
    .filter((entry) => entry.label.length <= maxLabelLength)

  if (entries.length === 0) {
    return null
  }

  return entries.reduce((acc, entry) => {
    acc[entry.label] = entry.value
    return acc
  }, {} as CountMap)
}

const toSortedSeries = (map: CountMap) => {
  const entries = Object.entries(map).map(([label, value]) => ({ label, value }))
  const numeric: ChartPoint[] = []
  const nonNumeric: ChartPoint[] = []

  entries.forEach((entry) => {
    if (/^\d{4}$/.test(entry.label)) {
      numeric.push(entry)
    } else {
      nonNumeric.push(entry)
    }
  })

  numeric.sort((a, b) => Number(a.label) - Number(b.label))
  nonNumeric.sort((a, b) => a.label.localeCompare(b.label))

  return [...numeric, ...nonNumeric]
}

const findCount = (map: CountMap | null, keys: string[]) => {
  if (!map) {
    return null
  }
  const normalizedKeys = keys.map((key) => toKey(key))
  for (const [label, value] of Object.entries(map)) {
    if (normalizedKeys.includes(toKey(label))) {
      return value
    }
  }
  return null
}

const formatPercent = (value: number) => {
  const rounded = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)
  return `${rounded}%`
}

const isYearLabel = (label: string) => /^\d{4}$/.test(label)

const filterYearSeries = (series: ChartPoint[]) => {
  const numeric = series.filter((entry) => isYearLabel(entry.label))
  return numeric.length > 0 ? numeric : series
}

const buildColorPalette = (count: number) =>
  Array.from({ length: count }, (_, index) => {
    const hue = (200 + index * 45) % 360
    return `hsl(${hue} 70% 52%)`
  })

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

const buildSummaryMetrics = (payload: unknown, trendSeries: ChartPoint[]) => {
  const metrics: SummaryMetric[] = []
  const totalResponses = extractTotalResponses(payload)

  if (totalResponses !== null) {
    metrics.push({
      label: "Total responses",
      value: totalResponses,
      sparkline: trendSeries.length > 0 ? trendSeries : undefined,
    })
  }

  if (!isRecord(payload)) {
    return metrics
  }

  const finalizedResponses = toNumber(payload.finalizedResponses)
  if (finalizedResponses !== null) {
    metrics.push({ label: "Finalized responses", value: finalizedResponses })
  }

  const draftResponses = toNumber(payload.draftResponses)
  if (draftResponses !== null) {
    metrics.push({ label: "Draft responses", value: draftResponses })
  }

  const employmentStatus = extractCountMap(payload, "employmentStatus")
  const employedCount = (findCount(employmentStatus, ["Employed"]) ?? 0) +
    (findCount(employmentStatus, ["Self employed", "Self-employed"]) ?? 0)

  if (employmentStatus && totalResponses) {
    const rate = (employedCount / totalResponses) * 100
    metrics.push({
      label: "Employment rate",
      value: formatPercent(rate),
      helper: `${employedCount.toLocaleString()} currently working`,
    })
  }

  const licensureStatus = extractCountMap(payload, "licensureStatus")
  if (licensureStatus) {
    const passed = findCount(licensureStatus, ["Passed"]) ?? 0
    const total = sumCountMap(licensureStatus)
    if (total > 0) {
      metrics.push({
        label: "PNLE pass rate",
        value: formatPercent((passed / total) * 100),
        helper: `${passed.toLocaleString()} passed`,
      })
    }
  }

  return metrics
}

const getMetricIcon = (label: string) => {
  const normalized = label.toLowerCase()

  if (normalized.includes("total")) {
    return Users
  }

  if (normalized.includes("finalized")) {
    return CheckCircle2
  }

  if (normalized.includes("draft")) {
    return ClipboardList
  }

  if (normalized.includes("employment")) {
    return Briefcase
  }

  if (normalized.includes("pnle") || normalized.includes("pass")) {
    return FileText
  }

  return Users
}


export default function PublicAnalyticsClient() {
  const searchParams = useSearchParams()

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

  const query = useQuery<unknown, Error>({
    queryKey: ["public-analytics", analyticsQuery],
    enabled: Boolean(token),
    staleTime: ANALYTICS_STALE_TIME,
    queryFn: async () => {
      const response = await fetch(
        `${getApiBaseUrl()}/api/v1/public/analytics?${analyticsQuery}`,
      )

      if (!response.ok) {
        throw new Error("Unable to load analytics data.")
      }

      return (await response.json()) as unknown
    },
  })

  const state = useMemo<{ status: AnalyticsStatus; data: unknown; error: string }>(() => {
    if (!token) {
      return { status: "error", data: null, error: "Missing analytics token." }
    }

    if (query.isError) {
      return { status: "error", data: null, error: toErrorMessage(query.error) }
    }

    if (query.data !== undefined) {
      return { status: "success", data: query.data, error: "" }
    }

    return { status: "loading", data: null, error: "" }
  }, [token, query.isError, query.error, query.data])

  const trendSeries = useMemo(() => {
    if (state.status !== "success") {
      return [] as ChartPoint[]
    }

    const yearlyMap =
      extractCountMap(state.data, "yearGraduated", { maxLabelLength: MAX_VALUE_LENGTH }) ??
      extractCountMap(state.data, "pnleYearPassed", { maxLabelLength: MAX_VALUE_LENGTH })

    return yearlyMap ? filterYearSeries(toSortedSeries(yearlyMap)) : []
  }, [state.status, state.data])

  const cumulativeSeries = useMemo(() => {
    if (trendSeries.length === 0) {
      return [] as ChartPoint[]
    }
    let running = 0
    return trendSeries.map((entry) => {
      running += entry.value
      return { label: entry.label, value: running }
    })
  }, [trendSeries])

  const employmentSeries = useMemo(() => {
    if (state.status !== "success") {
      return [] as PiePoint[]
    }

    const map = extractCountMap(state.data, "employmentStatus", { maxLabelLength: MAX_VALUE_LENGTH })
    if (!map) {
      return [] as PiePoint[]
    }

    const entries = toSortedSeries(map)
    const colors = buildColorPalette(entries.length)

    return entries.map((entry, index) => ({
      ...entry,
      fill: colors[index % colors.length],
    }))
  }, [state.status, state.data])

  const invitationSeries = useMemo(() => {
    if (state.status !== "success") {
      return [] as ChartPoint[]
    }

    const map = extractCountMap(state.data, "invitationChannels", { maxLabelLength: MAX_VALUE_LENGTH })
    if (!map) {
      return [] as ChartPoint[]
    }

    return toSortedSeries(map).sort((a, b) => b.value - a.value)
  }, [state.status, state.data])

  const summaryMetrics = useMemo(
    () => (state.status === "success" ? buildSummaryMetrics(state.data, trendSeries) : []),
    [state.status, state.data, trendSeries],
  )

  const categoricalBreakdowns = useMemo(
    () => (state.status === "success" ? collectCategoricalBreakdowns(state.data) : []),
    [state.status, state.data],
  )

  const trendChartConfig = useMemo(
    () => ({
      value: {
        label: "Responses",
        color: "hsl(var(--chart-2))",
      },
    }),
    [],
  )

  const cumulativeChartConfig = useMemo(
    () => ({
      value: {
        label: "Cumulative",
        color: "hsl(var(--chart-1))",
      },
    }),
    [],
  )

  const employmentChartConfig = useMemo(() => {
    if (employmentSeries.length === 0) {
      return {}
    }

    return employmentSeries.reduce((acc, entry) => {
      acc[entry.label] = {
        label: entry.label,
        color: entry.fill,
      }
      return acc
    }, {} as Record<string, { label: string; color: string }>)
  }, [employmentSeries])

  const invitationChartConfig = useMemo(
    () => ({
      value: {
        label: "Responses",
        color: "hsl(var(--chart-1))",
      },
    }),
    [],
  )

  return (
    <div className="relative min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--gold)_18%,transparent),transparent_70%)]"
      />
      <div className="flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto w-full max-w-6xl space-y-6 animate-fade-up">
          <div className="relative overflow-hidden rounded-2xl border border-maroon/15 bg-gradient-to-br from-white via-gold/10 to-white p-6 shadow-sm md:p-7">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-maroon/10 blur-2xl" />
            <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-maroon">Alumni Tracer Survey</p>
                <h1 className="text-3xl font-bold tracking-tight text-maroon md:text-4xl text-balance">Public Analytics Dashboard</h1>
                <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
                  Summary snapshots and breakdowns from the public analytics API.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-maroon/20 bg-white/90 px-3 py-1.5 text-xs font-semibold text-maroon shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
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
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <CardDescription>{metric.label}</CardDescription>
                              <CardTitle className="text-2xl text-maroon">
                                {metric.value}
                              </CardTitle>
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-maroon/10">
                              {(() => {
                                const Icon = getMetricIcon(metric.label)
                                return <Icon className="h-4 w-4 text-maroon" />
                              })()}
                            </div>
                          </div>
                        </CardHeader>
                        {(metric.helper || metric.sparkline) && (
                          <CardContent className="pt-0">
                            {metric.helper ? (
                              <p className="text-xs text-muted-foreground">{metric.helper}</p>
                            ) : null}
                            {metric.sparkline && metric.sparkline.length > 1 ? (
                              <div className="mt-2">
                                <ChartContainer
                                  className="aspect-auto h-16 w-full"
                                  config={{
                                    value: {
                                      label: metric.label,
                                      color: "hsl(var(--chart-3))",
                                    },
                                  }}
                                >
                                  <LineChart data={metric.sparkline} margin={{ top: 6, left: 0, right: 0 }}>
                                    <Line
                                      dataKey="value"
                                      stroke="var(--color-value)"
                                      strokeWidth={2}
                                      dot={false}
                                    />
                                  </LineChart>
                                </ChartContainer>
                              </div>
                            ) : null}
                          </CardContent>
                        )}
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

              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="border-maroon/15 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base text-maroon">Responses over time</CardTitle>
                    <CardDescription>Yearly trend based on reported graduation or PNLE year.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {trendSeries.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No trend data available.</p>
                    ) : (
                      <ChartContainer className="aspect-auto h-64 w-full" config={trendChartConfig}>
                        <LineChart data={trendSeries} margin={{ left: 8, right: 16, top: 12, bottom: 8 }}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                            tickMargin={8}
                          />
                          <YAxis tickLine={false} axisLine={false} width={32} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            dataKey="value"
                            type="monotone"
                            stroke="hsl(var(--chart-2))"
                            strokeWidth={3}
                            strokeOpacity={1}
                            connectNulls
                            dot={{ r: 3, fill: "hsl(var(--chart-2))" }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ChartContainer>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-maroon/15">
                  <CardHeader>
                    <CardTitle className="text-base text-maroon">Employment status</CardTitle>
                    <CardDescription>Share of respondents by current status.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {employmentSeries.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No employment data available.</p>
                    ) : (
                      <ChartContainer className="aspect-auto h-64 w-full" config={employmentChartConfig}>
                        <PieChart>
                          <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                          <Pie
                            data={employmentSeries}
                            dataKey="value"
                            nameKey="label"
                            innerRadius={60}
                            outerRadius={90}
                          >
                            {employmentSeries.map((entry) => (
                              <Cell
                                key={`employment-${entry.label}`}
                                fill={entry.fill}
                              />
                            ))}
                          </Pie>
                          <ChartLegend
                            verticalAlign="bottom"
                            content={<ChartLegendContent nameKey="label" />}
                          />
                        </PieChart>
                      </ChartContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="border-maroon/15">
                <CardHeader>
                  <CardTitle className="text-base text-maroon">Communication preferences</CardTitle>
                  <CardDescription>Preferred channels for alumni announcements.</CardDescription>
                </CardHeader>
                <CardContent>
                  {invitationSeries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No channel data available.</p>
                  ) : (
                    <ChartContainer className="aspect-auto h-72 w-full" config={invitationChartConfig}>
                      <BarChart
                        data={invitationSeries}
                        layout="vertical"
                        margin={{ left: 16, right: 24, top: 8, bottom: 8 }}
                      >
                        <CartesianGrid horizontal={false} />
                        <XAxis type="number" tickLine={false} axisLine={false} />
                        <YAxis
                          type="category"
                          dataKey="label"
                          tickLine={false}
                          axisLine={false}
                          width={140}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="value"
                          radius={[0, 6, 6, 0]}
                          fill="var(--color-value)"
                        />
                      </BarChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="border-maroon/15">
                <CardHeader>
                  <CardTitle className="text-base text-maroon">Cumulative responses</CardTitle>
                  <CardDescription>Running total over the same yearly window.</CardDescription>
                </CardHeader>
                <CardContent>
                  {cumulativeSeries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No cumulative data available.</p>
                  ) : (
                    <ChartContainer config={cumulativeChartConfig}>
                      <AreaChart data={cumulativeSeries} margin={{ left: 8, right: 16, top: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} width={32} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          dataKey="value"
                          type="monotone"
                          stroke="var(--color-value)"
                          fill="var(--color-value)"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ChartContainer>
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
