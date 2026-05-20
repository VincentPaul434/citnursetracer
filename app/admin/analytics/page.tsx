import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminShellHeader from "@/components/admin/dashboard/admin-shell-header"
import ShareLinkCard from "@/components/admin/analytics/share-link-card"
import { ADMIN_SESSION_COOKIE, parseAdminSession } from "@/lib/admin-auth"

export const metadata: Metadata = {
  title: "Admin Analytics - CIT Nursing Graduate Tracer",
  description: "Generate and share public analytics links for stakeholders.",
}

export default async function AdminAnalyticsPage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const session = parseAdminSession(sessionValue)

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--gold)_18%,transparent),transparent_70%)]"
      />

      <AdminShellHeader username="Admin" />

      <div className="flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto w-full max-w-5xl space-y-6 animate-fade-up">
          <div className="relative overflow-hidden rounded-2xl border border-maroon/15 bg-gradient-to-br from-white via-gold/10 to-white p-6 shadow-sm md:p-7">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-maroon/10 blur-2xl" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-maroon">Alumni Tracer Survey</p>
                <h2 className="text-3xl font-bold tracking-tight text-maroon md:text-4xl text-balance">Public Analytics Sharing</h2>
                <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
                  Generate a public analytics link that you can share with stakeholders, partners, or program reviewers.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" className="border-maroon/30 bg-white text-maroon hover:bg-maroon/5">
                  <Link href="/admin/dashboard">
                    <ArrowLeft className="h-4 w-4" />
                    Back to dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <ShareLinkCard />

          <Card className="border-maroon/15 shadow-sm">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-maroon/8 ring-1 ring-maroon/15">
                  <Eye className="h-4.5 w-4.5 text-maroon" />
                </div>
                <div>
                  <CardTitle className="text-lg text-maroon">What gets shared</CardTitle>
                  <CardDescription>
                    The link points to a public analytics view powered by the public analytics API.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Generate a new link to rotate access. Each link includes a time-limited token for the public analytics view, and anyone with
                the link can access it during that window.
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {["Token-based access", "Time-limited", "Read-only view", "Aggregated insights only"].map((item) => (
                  <li key={item} className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-foreground">
                    <Link2 className="h-3.5 w-3.5 text-maroon" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
