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
              {state.status === "success" && (
                <pre className="max-h-[520px] overflow-auto rounded-md bg-muted/70 p-4 text-xs text-foreground">
{JSON.stringify(state.data, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
