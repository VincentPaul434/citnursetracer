import { NextResponse } from "next/server"
import { buildAdminApiUrl } from "@/lib/admin-auth"

const SURVEY_EDIT_ENDPOINT = "/api/v1/submissions/edit"

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

const getEditTokenFromRequest = (request: Request, params?: { editToken?: string }) => {
  const paramToken = params?.editToken?.trim()
  if (paramToken) {
    return paramToken
  }

  try {
    const url = new URL(request.url)
    const segments = url.pathname.split("/").filter(Boolean)
    const candidate = segments[segments.length - 1]
    return candidate?.trim() || null
  } catch {
    return null
  }
}

export async function GET(request: Request, { params }: { params: { editToken?: string } }) {
  const editToken = getEditTokenFromRequest(request, params)

  if (!editToken) {
    return NextResponse.json(
      {
        message: "Missing edit token.",
      },
      { status: 400 },
    )
  }

  try {
    const backendResponse = await fetch(
      buildAdminApiUrl(`${SURVEY_EDIT_ENDPOINT}/${encodeURIComponent(editToken)}`),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      },
    )

    if (!backendResponse.ok) {
      let message = "Unable to load the saved survey response. Please try again."

      try {
        const payload = (await backendResponse.json()) as unknown
        const backendMessage = extractMessageFromPayload(payload)

        if (backendMessage) {
          message = backendMessage
        }
      } catch {
        message = "Unable to load the saved survey response. Please try again."
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

export async function PUT(request: Request, { params }: { params: { editToken?: string } }) {
  const editToken = getEditTokenFromRequest(request, params)
  let body: unknown

  if (!editToken) {
    return NextResponse.json(
      {
        message: "Missing edit token.",
      },
      { status: 400 },
    )
  }

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
    const backendResponse = await fetch(
      buildAdminApiUrl(`${SURVEY_EDIT_ENDPOINT}/${encodeURIComponent(editToken)}`),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    )

    if (!backendResponse.ok) {
      let message = "Unable to update the survey response right now. Please try again."

      try {
        const payload = (await backendResponse.json()) as unknown
        const backendMessage = extractMessageFromPayload(payload)

        if (backendMessage) {
          message = backendMessage
        }
      } catch {
        message = "Unable to update the survey response right now. Please try again."
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
