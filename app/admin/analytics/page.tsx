import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminNotificationCenter from "@/components/admin/dashboard/admin-notification-center"
import AdminUserMenu from "@/components/admin/dashboard/admin-user-menu"
import ShareLinkCard from "@/components/admin/analytics/share-link-card"
import { ADMIN_SESSION_COOKIE, parseAdminSession } from "@/lib/admin-auth"

export default async function AdminAnalyticsPage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const session = parseAdminSession(sessionValue)

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-maroon text-gold p-4 flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          <Image
            src="/cit2logo.png"
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
        <div className="flex items-center gap-2">
          <AdminNotificationCenter />
          <AdminUserMenu username="Admin" />
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <div className="rounded-lg border border-maroon/20 p-5 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-maroon">Alumni Tracer Survey</p>
            <h2 className="text-3xl font-bold text-maroon">Public Analytics Sharing</h2>
            <p className="text-foreground leading-relaxed">
              Generate a public analytics link that you can share with stakeholders.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="bg-white text-maroon hover:bg-maroon/5">
                <Link href="/admin/dashboard">Back to dashboard</Link>
              </Button>
            </div>
          </div>

          <ShareLinkCard />

          <Card className="border-maroon/20">
            <CardHeader>
              <CardTitle>What gets shared</CardTitle>
              <CardDescription>
                The link points to a public analytics view powered by the public analytics API. Anyone with the link can access it.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Generate a new link to rotate access. Each link includes a time-limited token for the public analytics view.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
