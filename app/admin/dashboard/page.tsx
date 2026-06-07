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
    <div className="flex min-h-screen flex-col bg-background">
      <AdminShellHeader username="Admin" />
      <AdminDashboardClient />
    </div>
  )
}
