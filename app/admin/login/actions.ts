"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  ADMIN_SESSION_COOKIE,
  buildAdminApiUrl,
  createAdminSessionValue,
  createTokenAuthHeader,
  getAdminSessionCookieOptions,
} from "@/lib/admin-auth"

export interface AdminLoginState {
  error: string | null
}

const AUTH_LOGIN_ENDPOINT = "/api/v1/auth/login"

const loginWithBackend = async (username: string, password: string) => {
  const response = await fetch(buildAdminApiUrl(AUTH_LOGIN_ENDPOINT), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  })

  if (!response.ok) {
    return {
      success: false,
      authHeader: null,
      isAuthFailure: response.status === 400 || response.status === 401 || response.status === 403,
    }
  }

  const payload = (await response.json()) as {
    token?: unknown
    tokenType?: unknown
  }

  const token = typeof payload.token === "string" ? payload.token.trim() : ""
  if (!token) {
    return {
      success: false,
      authHeader: null,
      isAuthFailure: false,
    }
  }

  const tokenType = typeof payload.tokenType === "string" ? payload.tokenType : "Bearer"

  return {
    success: true,
    authHeader: createTokenAuthHeader(token, tokenType),
    isAuthFailure: false,
  }
}

export async function loginAdminAction(_previousState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const username = formData.get("username")?.toString().trim() ?? ""
  const password = formData.get("password")?.toString() ?? ""

  if (!username || !password) {
    return {
      error: "Username and password are required.",
    }
  }

  let authHeader = ""

  try {
    const loginResult = await loginWithBackend(username, password)

    if (!loginResult.success || !loginResult.authHeader) {
      return {
        error: loginResult.isAuthFailure
          ? "Invalid username or password."
          : "Unable to sign in right now. Please try again.",
      }
    }

    authHeader = loginResult.authHeader
  } catch {
    return {
      error: "Unable to reach the admin server. Please try again.",
    }
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSessionValue(authHeader), getAdminSessionCookieOptions())

  redirect("/admin/dashboard")
}
