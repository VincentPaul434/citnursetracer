import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type CareerPreparationLevel =
  | "Very well prepared"
  | "Well prepared"
  | "Moderately prepared"
  | "Slightly prepared"
  | "Not prepared"

interface SurveySectionProgramEvaluationProps {
  careerPreparationLevel: string
  nursingProgramAspect: string
  nursingProgramSuggestion: string
  onCareerPreparationLevelChange: (value: CareerPreparationLevel) => void
  onProgramEvaluationTextChange: (field: "nursingProgramAspect" | "nursingProgramSuggestion", value: string) => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function SurveySectionProgramEvaluation({
  careerPreparationLevel,
  nursingProgramAspect,
  nursingProgramSuggestion,
  onCareerPreparationLevelChange,
  onProgramEvaluationTextChange,
  onBack,
  onSubmit,
}: SurveySectionProgramEvaluationProps) {
  return (
    <>
      <div className="mb-4 rounded-lg border border-maroon/20 p-5">
        <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon mb-3">Section 10 of 12</div>
        <h2 className="text-2xl font-bold text-maroon">Section VIII: Program Evaluation</h2>
        <p className="mt-2 text-sm text-muted-foreground">Description (optional)</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            How well did CIT-U prepare you for your professional career? <span className="text-maroon">*</span>
          </p>

          <Select
            value={careerPreparationLevel || undefined}
            onValueChange={(value) =>
              onCareerPreparationLevelChange(
                value as "Very well prepared" | "Well prepared" | "Moderately prepared" | "Slightly prepared" | "Not prepared",
              )
            }
          >
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder="Select preparation level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Very well prepared">Very well prepared</SelectItem>
              <SelectItem value="Well prepared">Well prepared</SelectItem>
              <SelectItem value="Moderately prepared">Moderately prepared</SelectItem>
              <SelectItem value="Slightly prepared">Slightly prepared</SelectItem>
              <SelectItem value="Not prepared">Not prepared</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            What aspect of the nursing program helped you the most? <span className="text-maroon">*</span>
          </p>

          <Textarea
            value={nursingProgramAspect}
            onChange={(e) => onProgramEvaluationTextChange("nursingProgramAspect", e.target.value)}
            placeholder="Long answer text"
            className="min-h-10 bg-transparent text-foreground border-0 border-b border-dotted border-maroon/30 rounded-none px-0 py-1 focus-visible:ring-0"
            required
          />
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Suggestion for improving the nursing program <span className="text-maroon">*</span>
          </p>

          <Textarea
            value={nursingProgramSuggestion}
            onChange={(e) => onProgramEvaluationTextChange("nursingProgramSuggestion", e.target.value)}
            placeholder="Long answer text"
            className="min-h-10 bg-transparent text-foreground border-0 border-b border-dotted border-maroon/30 rounded-none px-0 py-1 focus-visible:ring-0"
            required
          />
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