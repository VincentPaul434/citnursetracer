import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, buildAdminApiUrl, parseAdminSession } from "@/lib/admin-auth"

interface RouteContext {
  params: Promise<{ notificationId: string }>
}

export async function POST(_: Request, context: RouteContext) {
  const { notificationId } = await context.params

  if (!notificationId) {
    return NextResponse.json({ message: "Notification id is required." }, { status: 400 })
  }

  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const session = parseAdminSession(sessionValue)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const backendResponse = await fetch(
      buildAdminApiUrl(`/api/v1/admin/notifications/${notificationId}/read`),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: session.authHeader,
        },
        cache: "no-store",
      },
    )

    const payload = await backendResponse.json()
    return NextResponse.json(payload, { status: backendResponse.status })
  } catch {
    return NextResponse.json(
      { message: "Unable to mark notification as read." },
      { status: 502 },
    )
  }
}
