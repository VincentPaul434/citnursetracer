import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from "@/lib/admin-auth"

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  if (!isAdminSessionValid(sessionValue)) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-maroon/20">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>You are logged in as an administrator.</CardDescription>
          </div>

          <form action="/admin/logout" method="post">
            <Button type="submit" variant="outline">
              Log out
            </Button>
          </form>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Use this page as the starting point for admin-only tools and reports.</p>
          <p>Only users with a valid admin session can access this route.</p>
        </CardContent>
      </Card>
    </div>
  )
}
