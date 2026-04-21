import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, buildAdminApiUrl, parseAdminSession } from "@/lib/admin-auth"

export async function GET() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const session = parseAdminSession(sessionValue)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const backendResponse = await fetch(buildAdminApiUrl("/api/v1/admin/notifications/recent"), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: session.authHeader,
      },
      cache: "no-store",
    })

    const payload = await backendResponse.json()
    return NextResponse.json(payload, { status: backendResponse.status })
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch recent notifications." },
      { status: 502 },
    )
  }
}
