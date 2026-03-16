import { NextRequest, NextResponse } from "next/server"

const resolveBackendSubmissionUrl = () => {
  const configuredSubmissionUrl = process.env.BACKEND_SUBMISSION_URL?.trim()
  if (configuredSubmissionUrl) {
    return configuredSubmissionUrl.replace(/\/$/, "")
  }

  const configuredBaseUrl = process.env.BACKEND_API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_API_BASE_URL?.trim()
  const normalizedBaseUrl = (configuredBaseUrl || "http://localhost:8080").replace(/\/$/, "")

  if (/\/api\/v1\/submissions$/i.test(normalizedBaseUrl)) {
    return normalizedBaseUrl
  }

  if (/\/api\/v1$/i.test(normalizedBaseUrl)) {
    return `${normalizedBaseUrl}/submissions`
  }

  if (/\/api$/i.test(normalizedBaseUrl)) {
    return `${normalizedBaseUrl}/v1/submissions`
  }

  return `${normalizedBaseUrl}/api/v1/submissions`
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.text()
    const targetSubmissionUrl = resolveBackendSubmissionUrl()
    const backendResponse = await fetch(targetSubmissionUrl, {
      method: "POST",
      headers: {
        "Content-Type": request.headers.get("content-type") ?? "application/json",
        Accept: request.headers.get("accept") ?? "application/json",
      },
      body: requestBody,
      cache: "no-store",
    })

    const responseBody = await backendResponse.text()
    const contentType = backendResponse.headers.get("content-type")

    if (backendResponse.status === 403 && !responseBody.trim()) {
      return NextResponse.json(
        {
          message:
            "Backend denied submission (403). Verify BACKEND_API_BASE_URL points to backend root (for example, http://localhost:8080) and that Spring security permits POST /api/v1/submissions.",
          targetUrl: targetSubmissionUrl,
        },
        {
          status: 403,
        },
      )
    }

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: contentType ? { "Content-Type": contentType } : undefined,
    })
  } catch (error) {
    console.error("Failed to proxy survey submission", error)

    return NextResponse.json(
      {
        message: "Unable to connect to the backend service.",
      },
      {
        status: 503,
      },
    )
  }
}
