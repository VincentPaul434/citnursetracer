import { NextResponse } from "next/server"
import { buildAdminApiUrl } from "@/lib/admin-auth"

const ID_UPLOAD_ENDPOINT = "/api/v1/submissions/id-upload"

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
  let incomingFormData: FormData

  try {
    incomingFormData = await request.formData()
  } catch {
    return NextResponse.json(
      {
        message: "Invalid upload payload.",
      },
      { status: 400 },
    )
  }

  const file = incomingFormData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json(
      {
        message: "Please attach a file before uploading.",
      },
      { status: 400 },
    )
  }

  const backendFormData = new FormData()
  backendFormData.append("file", file)

  try {
    const backendResponse = await fetch(buildAdminApiUrl(ID_UPLOAD_ENDPOINT), {
      method: "POST",
      body: backendFormData,
      cache: "no-store",
    })

    if (!backendResponse.ok) {
      let message = "Unable to upload ID right now. Please try again."

      try {
        const payload = (await backendResponse.json()) as unknown
        const backendMessage = extractMessageFromPayload(payload)

        if (backendMessage) {
          message = backendMessage
        }
      } catch {
        message = "Unable to upload ID right now. Please try again."
      }

      return NextResponse.json(
        {
          message,
        },
        { status: backendResponse.status },
      )
    }

    const contentType = backendResponse.headers.get("content-type") ?? ""

    if (contentType.includes("application/json")) {
      const payload = (await backendResponse.json()) as unknown
      return NextResponse.json(payload, { status: backendResponse.status })
    }

    return NextResponse.json({ success: true }, { status: backendResponse.status })
  } catch {
    return NextResponse.json(
      {
        message: "Unable to reach the upload service. Please try again.",
      },
      { status: 502 },
    )
  }
}
