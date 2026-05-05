"use client"

import { useEffect, useMemo, useState } from "react"
import { Bell, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminNotification {
  id: string
  message: string
  createdAt: string
  isRead: boolean
}

const toStringValue = (value: unknown) => {
  if (typeof value !== "string") {
    return ""
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : ""
}

const toBooleanValue = (value: unknown, fallback = false) => {
  if (typeof value === "boolean") {
    return value
  }

  return fallback
}

const toAdminNotification = (payload: unknown, fallbackIndex: number): AdminNotification | null => {
  if (!payload || typeof payload !== "object") {
    return null
  }

  const item = payload as Record<string, unknown>
  const id =
    toStringValue(item.notificationId) ||
    toStringValue(item.id) ||
    toStringValue(item.uuid) ||
    `notification-${fallbackIndex}`

  const message =
    toStringValue(item.message) ||
    toStringValue(item.title) ||
    toStringValue(item.description) ||
    "New admin notification"

  const createdAt =
    toStringValue(item.createdAt) ||
    toStringValue(item.timestamp) ||
    toStringValue(item.eventTime) ||
    new Date().toISOString()

  const isRead =
    toBooleanValue(item.read, false) ||
    toBooleanValue(item.isRead, false)

  return {
    id,
    message,
    createdAt,
    isRead,
  }
}

const toNotifications = (payload: unknown) => {
  if (!Array.isArray(payload)) {
    return [] as AdminNotification[]
  }

  return payload
    .map((item, index) => toAdminNotification(item, index))
    .filter((item): item is AdminNotification => item !== null)
}

const byNewest = (a: AdminNotification, b: AdminNotification) => {
  const aDate = Date.parse(a.createdAt)
  const bDate = Date.parse(b.createdAt)

  if (Number.isNaN(aDate) || Number.isNaN(bDate)) {
    return 0
  }

  return bDate - aDate
}

const formatTimestamp = (value: string) => {
  const parsedDate = Date.parse(value)
  if (Number.isNaN(parsedDate)) {
    return "Unknown time"
  }

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(parsedDate))
}

export default function AdminNotificationCenter() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  )

  const refreshNotifications = async () => {
    const [recentResponse, unreadResponse] = await Promise.all([
      fetch("/api/admin/notifications/recent", {
        method: "GET",
        cache: "no-store",
      }),
      fetch("/api/admin/notifications/unread", {
        method: "GET",
        cache: "no-store",
      }),
    ])

    if (recentResponse.status === 401 || unreadResponse.status === 401) {
      window.location.href = "/admin/login"
      return
    }

    if (!recentResponse.ok) {
      throw new Error("Failed to fetch notifications")
    }

    const recentPayload = (await recentResponse.json()) as unknown
    const unreadPayload = unreadResponse.ok ? ((await unreadResponse.json()) as unknown) : []

    const recentNotifications = toNotifications(recentPayload)
    const unreadNotifications = toNotifications(unreadPayload)
    const unreadIds = new Set(unreadNotifications.map((item) => item.id))

    const merged = recentNotifications.map((item) => ({
      ...item,
      isRead: !unreadIds.has(item.id),
    }))

    setNotifications(merged.sort(byNewest))
  }

  const markAsRead = async (notificationId: string) => {
    const response = await fetch(`/api/admin/notifications/${notificationId}/read`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error("Failed to mark notification as read")
    }

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId
          ? {
              ...item,
              isRead: true,
            }
          : item,
      ),
    )
  }

  const markAllAsRead = async () => {
    const response = await fetch("/api/admin/notifications/read-all", {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read")
    }

    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
  }

  useEffect(() => {
    let isActive = true

    const load = async () => {
      try {
        await refreshNotifications()
      } catch {
        if (isActive) {
          setNotifications([])
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void load()

    const stream = new EventSource("/api/admin/notifications/stream")
    stream.onmessage = () => {
      void refreshNotifications()
    }

    stream.onerror = () => {
      stream.close()
    }

    return () => {
      isActive = false
      stream.close()
    }
  }, [])

  return (
    <DropdownMenu onOpenChange={(open) => open && void refreshNotifications()}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 rounded-full bg-maroon px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[min(24rem,90vw)]">
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span>Notifications</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => void markAllAsRead()}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="mr-1 h-3.5 w-3.5" />
            Mark all
          </Button>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isLoading ? (
          <DropdownMenuItem disabled>Loading notifications...</DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled>No notifications yet.</DropdownMenuItem>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start gap-1 py-2"
              onClick={() => !notification.isRead && void markAsRead(notification.id)}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <p className="line-clamp-2 text-sm font-medium leading-snug">{notification.message}</p>
                {!notification.isRead ? (
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-maroon" aria-hidden />
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">{formatTimestamp(notification.createdAt)}</p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
