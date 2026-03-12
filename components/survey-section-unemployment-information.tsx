import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type UnemploymentReasonField =
  | "currentlyPursuingFurtherStudies"
  | "lackOfWorkOpportunities"
  | "familyResponsibility"
  | "healthReasons"
  | "waitingForLicensureExam"
  | "other"

interface UnemploymentReasonsState {
  currentlyPursuingFurtherStudies: boolean
  lackOfWorkOpportunities: boolean
  familyResponsibility: boolean
  healthReasons: boolean
  waitingForLicensureExam: boolean
  other: boolean
}

interface SurveySectionUnemploymentInformationProps {
  unemploymentReasons: UnemploymentReasonsState
  unemploymentReasonOtherText: string
  unemploymentReasonError: string
  onUnemploymentReasonChange: (field: UnemploymentReasonField, checked: boolean) => void
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function SurveySectionUnemploymentInformation({
  unemploymentReasons,
  unemploymentReasonOtherText,
  unemploymentReasonError,
  onUnemploymentReasonChange,
  onTextChange,
  onBack,
  onSubmit,
}: SurveySectionUnemploymentInformationProps) {
  return (
    <>
      <div className="mb-4 rounded-lg border border-maroon/20 p-5">
        <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon mb-3">Section 8 of 12</div>
        <h2 className="text-2xl font-bold text-maroon">Section VI: Unemployment Information (If Unemployed)</h2>
        <p className="mt-2 text-sm text-muted-foreground">Description (optional)</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Reason for Unemployment <span className="text-maroon">*</span>
          </p>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={unemploymentReasons.currentlyPursuingFurtherStudies}
              onChange={(e) => onUnemploymentReasonChange("currentlyPursuingFurtherStudies", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Currently pursuing further studies</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={unemploymentReasons.lackOfWorkOpportunities}
              onChange={(e) => onUnemploymentReasonChange("lackOfWorkOpportunities", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Lack of work opportunities</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={unemploymentReasons.familyResponsibility}
              onChange={(e) => onUnemploymentReasonChange("familyResponsibility", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Family responsibility</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={unemploymentReasons.healthReasons}
              onChange={(e) => onUnemploymentReasonChange("healthReasons", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Health reasons</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={unemploymentReasons.waitingForLicensureExam}
              onChange={(e) => onUnemploymentReasonChange("waitingForLicensureExam", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Waiting for licensure exam</span>
          </label>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={unemploymentReasons.other}
              onChange={(e) => onUnemploymentReasonChange("other", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <Label htmlFor="unemploymentReasonOtherText" className="text-foreground text-sm">
              Other:
            </Label>
            <Input
              id="unemploymentReasonOtherText"
              type="text"
              value={unemploymentReasonOtherText}
              onChange={onTextChange}
              className="h-8 bg-transparent text-foreground border-0 border-b border-dotted border-maroon/30 rounded-none px-1 focus-visible:ring-0"
              required={unemploymentReasons.other}
            />
          </div>

          {unemploymentReasonError && <p className="text-sm text-maroon font-medium">{unemploymentReasonError}</p>}
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