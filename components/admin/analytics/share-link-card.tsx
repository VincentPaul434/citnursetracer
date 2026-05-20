"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, Copy, ExternalLink, Link2, RefreshCcw } from "lucide-react"
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
    <Card className="border-maroon/15 shadow-sm">
      <CardHeader className="space-y-3 border-b border-border/50 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/30 ring-1 ring-gold/40">
            <Link2 className="h-5 w-5 text-maroon" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg text-maroon">Share Public Analytics</CardTitle>
            <CardDescription className="leading-relaxed">
              Copy the public analytics link and share it with stakeholders. Anyone with the link can view the analytics.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        {error ? (
          <p className="rounded-md border border-maroon/25 bg-maroon/5 px-3 py-2 text-sm font-medium text-maroon animate-fade-in">{error}</p>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="shareable-link">Shareable link</label>
          <div className="relative">
            <Input
              id="shareable-link"
              ref={inputRef}
              value={shareUrl || "Generate a public analytics link."}
              readOnly
              className={`bg-white pr-12 font-mono text-sm ${shareUrl ? "text-foreground" : "text-muted-foreground italic"}`}
              onFocus={(e) => shareUrl && e.currentTarget.select()}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleCopy}
              disabled={!shareUrl}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Copy link"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Expires at</p>
            <p className="text-sm font-medium text-foreground">
              {shareToken ? formatExpiresAt(expiresAt) : "Generate a link to see the expiry"}
            </p>
          </div>
          {backendUrl ? (
            <div className="rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Backend URL</p>
              <p className="break-all text-xs font-mono text-foreground">{backendUrl}</p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={requestShareLink} disabled={isLoading}>
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
                Generating...
              </span>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4" />
                {shareUrl ? "Generate new link" : "Generate link"}
              </>
            )}
          </Button>
          <Button type="button" onClick={handleCopy} disabled={!shareUrl} variant="outline">
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy link
              </>
            )}
          </Button>
          {shareUrl ? (
            <Button asChild variant="outline" className="bg-white text-maroon hover:bg-maroon/5">
              <a href={shareUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open public analytics
              </a>
            </Button>
          ) : (
            <Button type="button" variant="outline" disabled>
              <ExternalLink className="h-4 w-4" />
              Open public analytics
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
