import type { SurveyFormData } from "@/lib/survey-mapping"

type SurveyApiResult =
  | {
      ok: true
      payload: unknown
    }
  | {
      ok: false
      message: string
    }

const extractMessageFromPayload = (payload: unknown) => {
  if (!payload || typeof payload !== "object") {
    return null
  }

  const message = (payload as { message?: unknown }).message
  if (typeof message !== "string") {
    return null
  }

  const trimmed = message.trim()
  return trimmed.length > 0 ? trimmed : null
}

export const fetchSurveyResponseByEditToken = async (editToken: string): Promise<SurveyApiResult> => {
  try {
    const response = await fetch(`/api/survey-responses/edit/${encodeURIComponent(editToken)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    const payload = (await response.json().catch(() => null)) as unknown

    if (!response.ok) {
      const message = extractMessageFromPayload(payload) ?? "Unable to load the saved survey response. Please try again."
      return { ok: false, message }
    }

    return { ok: true, payload }
  } catch {
    return { ok: false, message: "Unable to reach the survey service. Please try again." }
  }
}

export const submitSurveyResponse = async (
  formData: SurveyFormData,
  editToken?: string | null,
): Promise<SurveyApiResult> => {
  const isUpdate = Boolean(editToken)
  const endpoint = editToken ? `/api/survey-responses/edit/${encodeURIComponent(editToken)}` : "/api/survey-responses"
  const method = editToken ? "PUT" : "POST"
  const defaultMessage = isUpdate
    ? "Unable to update the survey response right now. Please try again."
    : "Unable to submit survey right now. Please try again."

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })

    const payload = (await response.json().catch(() => null)) as unknown

    if (!response.ok) {
      const message = extractMessageFromPayload(payload) ?? defaultMessage
      return { ok: false, message }
    }

    return { ok: true, payload }
  } catch {
    return { ok: false, message: "Unable to reach the server. Please check your connection and try again." }
  }
}
