import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { buildResponseSections } from "./response-sections"

interface ResponseDetailsDialogProps {
  email: string
  details: Record<string, unknown>
}

export default function ResponseDetailsDialog({ email, details }: ResponseDetailsDialogProps) {
  const sections = buildResponseSections(details)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Survey Response</DialogTitle>
          <DialogDescription>Organized response summary for {email}.</DialogDescription>
        </DialogHeader>

        {sections.length === 0 ? (
          <p className="text-sm text-muted-foreground">No response details available.</p>
        ) : (
          <div className="space-y-5">
            {sections.map((section, index) => (
              <section key={section.key} className="space-y-3">
                {index > 0 ? <Separator /> : null}
                <h3 className="text-sm font-semibold uppercase tracking-wide text-maroon">{section.title}</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {section.rows.map((row) => (
                    <div key={row.key} className="rounded-md border p-3 bg-card">
                      <p className="text-xs font-medium text-muted-foreground">{row.label}</p>
                      <p className="mt-1 text-sm whitespace-pre-wrap wrap-break-word">{row.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
