"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ShareLinkCardProps {
  sharePath?: string
}

type ShareTokenResponse = {
  token?: string
  url?: string | null
  expiresAt?: string | null
}

const buildShareUrl = (origin: string, path: string, token: string) => {
  if (!token) {
    return ""
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const base = origin ? `${origin}${normalizedPath}` : normalizedPath
  const params = new URLSearchParams({ token })
  return `${base}?${params.toString()}`
}

const formatExpiresAt = (value: string | null | undefined) => {
  if (!value) {
    return "No expiry provided"
  }

  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) {
    return "No expiry provided"
  }

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(parsed))
}

export default function ShareLinkCard({ sharePath = "/analytics" }: ShareLinkCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [origin, setOrigin] = useState("")
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [shareToken, setShareToken] = useState("")
  const [backendUrl, setBackendUrl] = useState("")
  const [expiresAt, setExpiresAt] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  const shareUrl = useMemo(
    () => buildShareUrl(origin, sharePath, shareToken),
    [origin, sharePath, shareToken],
  )

  const requestShareLink = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/public-analytics/share", {
        method: "POST",
      })

      const payload = (await response.json().catch(() => null)) as ShareTokenResponse | null

      if (!response.ok) {
        setError("Unable to generate a public analytics link.")
        setShareToken("")
        setBackendUrl("")
        setExpiresAt(null)
        return
      }

      const tokenValue = payload?.token ?? ""
      setShareToken(tokenValue)
      setBackendUrl(payload?.url ?? "")
      setExpiresAt(payload?.expiresAt ?? null)
    } catch {
      setError("Unable to reach the analytics service.")
      setShareToken("")
      setBackendUrl("")
      setExpiresAt(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!shareUrl) {
      return
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
        document.execCommand("copy")
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Card className="border-maroon/20">
      <CardHeader className="space-y-2">
        <CardTitle>Share Public Analytics</CardTitle>
        <CardDescription>
          Copy the public analytics link and share it with stakeholders. Anyone with the link can view the analytics.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? <p className="text-sm text-maroon">{error}</p> : null}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Shareable link</label>
          <Input
            ref={inputRef}
            value={shareUrl || "Generate a public analytics link."}
            readOnly
            className="bg-white"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {shareToken
            ? `Expires at ${formatExpiresAt(expiresAt)}`
            : "Generate a link to see the expiry."}
        </div>
        {backendUrl ? (
          <p className="text-xs text-muted-foreground break-all">
            Backend URL: {backendUrl}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={requestShareLink} disabled={isLoading}>
            {isLoading ? "Generating..." : shareUrl ? "Generate new link" : "Generate link"}
          </Button>
          <Button type="button" onClick={handleCopy} disabled={!shareUrl} variant="outline">
            {copied ? "Copied" : "Copy link"}
          </Button>
          {shareUrl ? (
            <Button
              asChild
              variant="outline"
              className="bg-white text-maroon hover:bg-maroon/5"
            >
              <a href={shareUrl} target="_blank" rel="noreferrer">
                Open public analytics
              </a>
            </Button>
          ) : (
            <Button type="button" variant="outline" disabled>
              Open public analytics
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
