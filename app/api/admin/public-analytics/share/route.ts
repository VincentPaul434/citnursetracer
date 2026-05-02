import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, buildAdminApiUrl, parseAdminSession } from "@/lib/admin-auth"

export async function POST(request: Request) {
  const { search } = new URL(request.url)
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const session = parseAdminSession(sessionValue)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const backendResponse = await fetch(
      `${buildAdminApiUrl("/api/v1/admin/public-analytics/share")}${search}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: session.authHeader,
        },
        cache: "no-store",
      },
    )

    const payload = await backendResponse.json().catch(() => null)
    if (!payload) {
      return NextResponse.json(
        { message: "Unable to generate a share link." },
        { status: backendResponse.status },
      )
    }

    return NextResponse.json(payload, { status: backendResponse.status })
  } catch {
    return NextResponse.json(
      { message: "Unable to generate a share link." },
      { status: 502 },
    )
  }
}
