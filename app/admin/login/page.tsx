import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ADMIN_SESSION_COOKIE, buildAdminApiUrl, parseAdminSession } from "@/lib/admin-auth"
import AdminLoginForm from "./admin-login-form"

export const metadata: Metadata = {
  title: "Admin Login - CIT Nursing Graduate Tracer",
  description: "Sign in to access the CIT nursing tracer admin dashboard.",
}

const ADMIN_SESSION_VALIDATE_ENDPOINT = "/api/v1/admin/survey-responses?page=0&size=1"

export default async function AdminLoginPage() {
  const cookieStore = await cookies()
  const existingSessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const session = parseAdminSession(existingSessionValue)

  if (session) {
    try {
      const sessionValidationResponse = await fetch(buildAdminApiUrl(ADMIN_SESSION_VALIDATE_ENDPOINT), {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: session.authHeader,
        },
        cache: "no-store",
      })

      if (sessionValidationResponse.ok) {
        redirect("/admin/dashboard")
      }
    } catch {}
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute inset-0">
        <Image src="/cit-nurse-bg.jpg" alt="CIT Nursing background" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-maroon/30 via-background/70 to-background/85" />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-maroon/15 bg-card/95 backdrop-blur-md shadow-2xl shadow-maroon/20 animate-fade-up">
        <CardHeader className="space-y-3 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-maroon/8 ring-1 ring-maroon/15">
              <Image src="/cit2logo.png" alt="CIT-U Logo" width={36} height={36} className="h-9 w-9 object-contain" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">CIT-U Tracer</p>
              <CardTitle className="text-xl text-maroon">Admin Login</CardTitle>
            </div>
          </div>
          <CardDescription className="leading-relaxed">
            Sign in to review survey responses, share analytics, and manage notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <AdminLoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
