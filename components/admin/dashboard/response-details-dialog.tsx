import { Eye, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { buildResponseSections } from "./response-sections"

interface ResponseDetailsDialogProps {
  email: string
  details: Record<string, unknown>
}

export default function ResponseDetailsDialog({ email, details }: ResponseDetailsDialogProps) {
  const sections = buildResponseSections(details)

  function humanize(str?: string) {
    if (!str) return ""
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
  }

  function formatMultiAnswer(val: unknown) {
    if (Array.isArray(val)) {
      return val.map((v) => humanize(String(v).trim())).join(", ")
    }
    if (typeof val === "string" && val.includes(",")) {
      return val
        .split(",")
        .map((v) => humanize(v.trim()))
        .join(", ")
    }
    return humanize(String(val))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="space-y-3 border-b border-border/60 bg-gradient-to-br from-white via-gold/10 to-white px-6 py-5 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-maroon/8 ring-1 ring-maroon/15">
              <Mail className="h-5 w-5 text-maroon" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Alumni response</p>
              <DialogTitle className="text-xl text-maroon">Survey Response</DialogTitle>
              <DialogDescription className="text-sm">
                Organized response summary for{" "}
                <span className="font-medium text-foreground">{email}</span>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(88vh-7rem)] overflow-y-auto px-6 py-5">
          {sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Eye className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">No response details available</p>
                <p className="text-xs">This entry has no recorded answers yet.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-7">
              {sections.map((section, index) => (
                <section key={section.key} className="space-y-3 animate-fade-up" style={{ animationDelay: `${index * 35}ms` }}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-maroon/8 px-2 text-xs font-bold uppercase tracking-wider text-maroon ring-1 ring-maroon/15">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-maroon">{section.title}</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-maroon/20 via-border to-transparent" />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {section.rows.map((row) => (
                      <div
                        key={row.key}
                        className="group rounded-lg border border-border/60 bg-card p-3.5 transition-all duration-200 hover:border-maroon/25 hover:bg-card hover:shadow-sm"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{row.label}</p>
                        <p className="mt-1.5 whitespace-pre-wrap break-words text-sm font-medium text-foreground">
                          {formatMultiAnswer(row.value) || <span className="italic text-muted-foreground">—</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
