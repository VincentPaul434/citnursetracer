import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminShellHeader from "@/components/admin/dashboard/admin-shell-header"
import AdminDashboardClient from "./admin-dashboard-client"
import { ADMIN_SESSION_COOKIE, parseAdminSession } from "@/lib/admin-auth"

export const metadata: Metadata = {
  title: "Admin Dashboard - CIT Nursing Graduate Tracer",
  description: "Review nursing graduate survey responses and analytics.",
}

export default async function AdminDashboardPage() {
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
      <AdminDashboardClient />
    </div>
  )
}
