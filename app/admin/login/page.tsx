import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from "@/lib/admin-auth"
import AdminLoginForm from "./admin-login-form"

export default async function AdminLoginPage() {
  const cookieStore = await cookies()
  const existingSessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  if (isAdminSessionValid(existingSessionValue)) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-maroon/20">
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
