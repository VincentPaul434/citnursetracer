import { createHmac, timingSafeEqual } from "crypto"

export const ADMIN_SESSION_COOKIE = "citnurse_admin_session"

const DEFAULT_ADMIN_API_BASE_URL = "http://localhost:8080"
const DEFAULT_ADMIN_SESSION_SECRET = "citnurse-admin-session-secret"
const SESSION_DURATION_SECONDS = 60 * 60 * 8

export interface AdminSession {
  authHeader: string
  expiresAtUnixSeconds: number
}

const getConfiguredValue = (value: string | undefined, fallback: string) => {
  if (!value) {
    return fallback
  }

  const trimmedValue = value.trim()
  return trimmedValue.length > 0 ? trimmedValue : fallback
}

const getSessionSecret = () =>
  getConfiguredValue(process.env.ADMIN_SESSION_SECRET, DEFAULT_ADMIN_SESSION_SECRET)

const trimTrailingSlash = (value: string) => (value.endsWith("/") ? value.slice(0, -1) : value)

const toBase64Url = (value: string) => Buffer.from(value, "utf-8").toString("base64url")

const fromBase64Url = (value: string) => {
  try {
    return Buffer.from(value, "base64url").toString("utf-8")
  } catch {
    return null
  }
}

const safeEqual = (value: string, expectedValue: string) => {
  const valueBuffer = Buffer.from(value)
  const expectedBuffer = Buffer.from(expectedValue)

  if (valueBuffer.length !== expectedBuffer.length) {
    return false
  }

  return timingSafeEqual(valueBuffer, expectedBuffer)
}

const createSessionSignature = (payload: string) => createHmac("sha256", getSessionSecret()).update(payload).digest("hex")

export const getAdminApiBaseUrl = () =>
  trimTrailingSlash(getConfiguredValue(process.env.ADMIN_API_BASE_URL, DEFAULT_ADMIN_API_BASE_URL))

export const buildAdminApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${getAdminApiBaseUrl()}${normalizedPath}`
}

export const createTokenAuthHeader = (token: string, tokenType = "Bearer") => {
  return `${tokenType.trim() || "Bearer"} ${token.trim()}`
}

export const createAdminSessionValue = (authHeader: string, now = Date.now()) => {
  const expiresAtUnixSeconds = Math.floor(now / 1000) + SESSION_DURATION_SECONDS
  const encodedAuthHeader = toBase64Url(authHeader)
  const payload = `${expiresAtUnixSeconds}.${encodedAuthHeader}`
  const signature = createSessionSignature(payload)

  return `${payload}.${signature}`
}

export const parseAdminSession = (sessionValue: string | undefined, now = Date.now()): AdminSession | null => {
  if (!sessionValue) {
    return null
  }

  const [expiresAtUnixSeconds, encodedAuthHeader, providedSignature] = sessionValue.split(".")

  if (!expiresAtUnixSeconds || !encodedAuthHeader || !providedSignature) {
    return null
  }

  const payload = `${expiresAtUnixSeconds}.${encodedAuthHeader}`
  const expectedSignature = createSessionSignature(payload)
  if (!safeEqual(providedSignature, expectedSignature)) {
    return null
  }

  const expiresAt = Number.parseInt(expiresAtUnixSeconds, 10)
  if (Number.isNaN(expiresAt)) {
    return null
  }

  if (expiresAt <= Math.floor(now / 1000)) {
    return null
  }

  const authHeader = fromBase64Url(encodedAuthHeader)
  if (!authHeader) {
    return null
  }

  const [authScheme, authValue] = authHeader.trim().split(/\s+/, 2)
  if (!authScheme || !authValue) {
    return null
  }

  if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(authScheme)) {
    return null
  }

  return {
    authHeader,
    expiresAtUnixSeconds: expiresAt,
  }
}

export const isAdminSessionValid = (sessionValue: string | undefined, now = Date.now()) => {
  return parseAdminSession(sessionValue, now) !== null
}

export const getAdminSessionCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
})
