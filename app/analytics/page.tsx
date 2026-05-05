import type { Metadata } from "next"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PublicAnalyticsClient from "./public-analytics-client"

export const metadata: Metadata = {
  title: "Public Analytics - CIT Nursing Graduate Tracer",
  description:
    "View public analytics for the CIT University nursing graduate tracer survey.",
}

function AnalyticsFallback() {
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
              <p className="text-sm text-muted-foreground">Loading analytics...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PublicAnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsFallback />}>
      <PublicAnalyticsClient />
    </Suspense>
  )
}
