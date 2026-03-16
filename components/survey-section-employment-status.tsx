import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SurveySectionEmploymentStatusProps {
  employmentStatus: string
  onEmploymentStatusChange: (value: "Employed" | "Self employed" | "Unemployed" | "Currently studying") => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function SurveySectionEmploymentStatus({
  employmentStatus,
  onEmploymentStatusChange,
  onBack,
  onSubmit,
}: SurveySectionEmploymentStatusProps) {
  return (
    <>
      <div className="mb-4 rounded-lg border border-maroon/20 p-5">
        <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon mb-3">Section 6 of 12</div>
        <h2 className="text-2xl font-bold text-maroon">Section IV. Employment Status</h2>
        <p className="mt-2 text-sm text-muted-foreground">Description (optional)</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Current employment status <span className="text-maroon">*</span>
          </p>

          <Select
            value={employmentStatus || undefined}
            onValueChange={(value) =>
              onEmploymentStatusChange(value as "Employed" | "Self employed" | "Unemployed" | "Currently studying")
            }
          >
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Employed">Employed</SelectItem>
              <SelectItem value="Self employed">Self employed</SelectItem>
              <SelectItem value="Unemployed">Unemployed</SelectItem>
              <SelectItem value="Currently studying">Currently studying</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" onClick={onBack} variant="secondary" className="bg-gold text-maroon hover:bg-gold/90">
            Back
          </Button>
          <Button type="submit" className="bg-gold text-maroon hover:bg-gold/90 font-semibold px-8">
            Continue
          </Button>
        </div>
      </form>
    </>
  )
}
