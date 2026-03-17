import { createHmac, timingSafeEqual } from "crypto"

export const ADMIN_SESSION_COOKIE = "citnurse_admin_session"

const DEFAULT_ADMIN_USERNAME = "admin"
const DEFAULT_ADMIN_PASSWORD = "admin12345"
const SESSION_DURATION_SECONDS = 60 * 60 * 8

const getConfiguredValue = (value: string | undefined, fallback: string) => {
  if (!value) {
    return fallback
  }

  const trimmedValue = value.trim()
  return trimmedValue.length > 0 ? trimmedValue : fallback
}

const getAdminUsername = () => getConfiguredValue(process.env.ADMIN_USERNAME, DEFAULT_ADMIN_USERNAME)
const getAdminPassword = () => getConfiguredValue(process.env.ADMIN_PASSWORD, DEFAULT_ADMIN_PASSWORD)

const getSessionSecret = () =>
  getConfiguredValue(process.env.ADMIN_SESSION_SECRET, `${getAdminUsername()}-${getAdminPassword()}-session-secret`)

const safeEqual = (value: string, expectedValue: string) => {
  const valueBuffer = Buffer.from(value)
  const expectedBuffer = Buffer.from(expectedValue)

  if (valueBuffer.length !== expectedBuffer.length) {
    return false
  }

  return timingSafeEqual(valueBuffer, expectedBuffer)
}

const createSessionSignature = (payload: string) => createHmac("sha256", getSessionSecret()).update(payload).digest("hex")

export const verifyAdminCredentials = (username: string, password: string) => {
  return safeEqual(username, getAdminUsername()) && safeEqual(password, getAdminPassword())
}

export const createAdminSessionValue = (now = Date.now()) => {
  const expiresAtUnixSeconds = Math.floor(now / 1000) + SESSION_DURATION_SECONDS
  const payload = `${expiresAtUnixSeconds}`
  const signature = createSessionSignature(payload)

  return `${payload}.${signature}`
}

export const isAdminSessionValid = (sessionValue: string | undefined, now = Date.now()) => {
  if (!sessionValue) {
    return false
  }

  const [expiresAtUnixSeconds, providedSignature] = sessionValue.split(".")

  if (!expiresAtUnixSeconds || !providedSignature) {
    return false
  }

  const expectedSignature = createSessionSignature(expiresAtUnixSeconds)
  if (!safeEqual(providedSignature, expectedSignature)) {
    return false
  }

  const expiresAt = Number.parseInt(expiresAtUnixSeconds, 10)
  if (Number.isNaN(expiresAt)) {
    return false
  }

  return expiresAt > Math.floor(now / 1000)
}

export const getAdminSessionCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
})
