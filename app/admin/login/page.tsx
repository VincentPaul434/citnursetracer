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
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0">
        <Image src="/cit-nurse-bg.jpg" alt="CIT Nursing background" fill priority className="object-cover opacity-100" />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-maroon/20 bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Sign in to access the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
