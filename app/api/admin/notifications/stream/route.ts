import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, buildAdminApiUrl, parseAdminSession } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const session = parseAdminSession(sessionValue)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const backendResponse = await fetch(buildAdminApiUrl("/api/v1/admin/notifications/stream"), {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        Authorization: session.authHeader,
      },
      cache: "no-store",
    })

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: "Unable to open notification stream." },
        { status: backendResponse.status },
      )
    }

    if (!backendResponse.body) {
      return NextResponse.json(
        { message: "Notification stream is unavailable." },
        { status: 502 },
      )
    }

    return new Response(backendResponse.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to notification stream." },
      { status: 502 },
    )
  }
}
