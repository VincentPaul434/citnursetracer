import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const unemploymentReasonOptions: Array<{ field: UnemploymentReasonField; label: string }> = [
    { field: "currentlyPursuingFurtherStudies", label: "Currently pursuing further studies" },
    { field: "lackOfWorkOpportunities", label: "Lack of work opportunities" },
    { field: "familyResponsibility", label: "Family responsibility" },
    { field: "healthReasons", label: "Health reasons" },
    { field: "waitingForLicensureExam", label: "Waiting for licensure exam" },
    { field: "other", label: "Other" },
  ]

  const selectedUnemploymentReason = unemploymentReasonOptions.find(({ field }) => unemploymentReasons[field])?.field

  const handleUnemploymentReasonSelectChange = (value: string) => {
    const selectedField = value as UnemploymentReasonField

    unemploymentReasonOptions.forEach(({ field }) => {
      onUnemploymentReasonChange(field, field === selectedField)
    })
  }

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

          <Select value={selectedUnemploymentReason} onValueChange={handleUnemploymentReasonSelectChange}>
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder="Select reason for unemployment" />
            </SelectTrigger>
            <SelectContent>
              {unemploymentReasonOptions.map((option) => (
                <SelectItem key={option.field} value={option.field}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {unemploymentReasons.other && (
            <div className="space-y-2">
              <Label htmlFor="unemploymentReasonOtherText" className="text-foreground text-sm">
                Please specify
              </Label>
              <Input
                id="unemploymentReasonOtherText"
                type="text"
                value={unemploymentReasonOtherText}
                onChange={onTextChange}
                className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
                required
              />
            </div>
          )}

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