"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  getAdminSessionCookieOptions,
  verifyAdminCredentials,
} from "@/lib/admin-auth"

export interface AdminLoginState {
  error: string | null
}

export const initialAdminLoginState: AdminLoginState = {
  error: null,
}

export async function loginAdminAction(_previousState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const username = formData.get("username")?.toString().trim() ?? ""
  const password = formData.get("password")?.toString() ?? ""

  if (!username || !password) {
    return {
      error: "Username and password are required.",
    }
  }

  if (!verifyAdminCredentials(username, password)) {
    return {
      error: "Invalid username or password.",
    }
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSessionValue(), getAdminSessionCookieOptions())

  redirect("/admin")
}
