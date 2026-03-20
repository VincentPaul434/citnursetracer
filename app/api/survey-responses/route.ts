import { NextResponse } from "next/server"
import { buildAdminApiUrl } from "@/lib/admin-auth"

const SURVEY_SUBMIT_ENDPOINT = "/api/v1/submissions"

const extractMessageFromPayload = (payload: unknown) => {
  if (!payload || typeof payload !== "object") {
    return null
  }

  const message = (payload as { message?: unknown }).message
  if (typeof message !== "string") {
    return null
  }

  const trimmedMessage = message.trim()
  return trimmedMessage.length > 0 ? trimmedMessage : null
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      {
        message: "Invalid survey payload.",
      },
      { status: 400 },
    )
  }

  try {
    const backendResponse = await fetch(buildAdminApiUrl(SURVEY_SUBMIT_ENDPOINT), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    if (!backendResponse.ok) {
      let message = "Unable to submit survey right now. Please try again."

      try {
        const payload = (await backendResponse.json()) as unknown
        const backendMessage = extractMessageFromPayload(payload)

        if (backendMessage) {
          message = backendMessage
        }
      } catch {
        message = "Unable to submit survey right now. Please try again."
      }

      return NextResponse.json(
        {
          message,
        },
        { status: backendResponse.status },
      )
    }

    const responseType = backendResponse.headers.get("content-type") ?? ""

    if (responseType.includes("application/json")) {
      const payload = (await backendResponse.json()) as unknown
      return NextResponse.json(payload, { status: backendResponse.status })
    }

    return NextResponse.json({ success: true }, { status: backendResponse.status })
  } catch {
    return NextResponse.json(
      {
        message: "Unable to reach the survey service. Please try again.",
      },
      { status: 502 },
    )
  }
}
