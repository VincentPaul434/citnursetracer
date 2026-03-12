import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SurveySectionLicensureExaminationProps {
  hasTakenPnle: string
  licensureStatus: string
  pnleYearPassed: string
  pnleYearPassedOther: string
  examTakeCount: string
  onHasTakenPnleChange: (value: "Yes" | "No") => void
  onLicensureStatusChange: (value: "Passed" | "Failed" | "Waiting for results") => void
  onPnleYearPassedChange: (value: string) => void
  onExamTakeCountChange: (value: "1" | "2" | "3 or more") => void
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function SurveySectionLicensureExamination({
  hasTakenPnle,
  licensureStatus,
  pnleYearPassed,
  pnleYearPassedOther,
  examTakeCount,
  onHasTakenPnleChange,
  onLicensureStatusChange,
  onPnleYearPassedChange,
  onExamTakeCountChange,
  onTextChange,
  onBack,
  onSubmit,
}: SurveySectionLicensureExaminationProps) {
  const requiresLicensureDetails = hasTakenPnle === "Yes"

  return (
    <>
      <div className="mb-4 rounded-lg border border-maroon/20 p-5">
        <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon mb-3">Section 5 of 12</div>
        <h2 className="text-2xl font-bold text-maroon">Section III. Licensure Examination</h2>
        <p className="mt-2 text-sm text-muted-foreground">Description (optional)</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Have you taken the Philippines Nursing Licensure Exam (PNLE)? <span className="text-maroon">*</span>
          </p>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="hasTakenPnle"
              checked={hasTakenPnle === "Yes"}
              onChange={() => onHasTakenPnleChange("Yes")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>Yes</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="hasTakenPnle"
              checked={hasTakenPnle === "No"}
              onChange={() => onHasTakenPnleChange("No")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>No</span>
          </label>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            If yes, what is your licensure status? <span className="text-maroon">*</span>
          </p>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="licensureStatus"
              checked={licensureStatus === "Passed"}
              onChange={() => onLicensureStatusChange("Passed")}
              className="h-4 w-4 accent-maroon"
              required={requiresLicensureDetails}
            />
            <span>Passed</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="licensureStatus"
              checked={licensureStatus === "Failed"}
              onChange={() => onLicensureStatusChange("Failed")}
              className="h-4 w-4 accent-maroon"
              required={requiresLicensureDetails}
            />
            <span>Failed</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="licensureStatus"
              checked={licensureStatus === "Waiting for results"}
              onChange={() => onLicensureStatusChange("Waiting for results")}
              className="h-4 w-4 accent-maroon"
              required={requiresLicensureDetails}
            />
            <span>Waiting for results</span>
          </label>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Year you passed the Philippines Nursing Licensure Exam (PNLE) <span className="text-maroon">*</span>
          </p>

          {["2020", "2021", "2022", "2023", "2024", "2025"].map((year) => (
            <label key={year} className="flex items-center gap-3 text-foreground cursor-pointer">
              <input
                type="radio"
                name="pnleYearPassed"
                checked={pnleYearPassed === year}
                onChange={() => onPnleYearPassedChange(year)}
                className="h-4 w-4 accent-maroon"
                required={requiresLicensureDetails}
              />
              <span>{year}</span>
            </label>
          ))}

          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="pnleYearPassed"
              checked={pnleYearPassed === "Other"}
              onChange={() => onPnleYearPassedChange("Other")}
              className="h-4 w-4 accent-maroon"
              required={requiresLicensureDetails}
            />
            <Label htmlFor="pnleYearPassedOther" className="text-foreground text-sm">
              Other:
            </Label>
            <Input
              id="pnleYearPassedOther"
              type="text"
              value={pnleYearPassedOther}
              onChange={onTextChange}
              className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
              required={requiresLicensureDetails && pnleYearPassed === "Other"}
            />
          </div>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Number of times you took the exam. <span className="text-maroon">*</span>
          </p>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="examTakeCount"
              checked={examTakeCount === "1"}
              onChange={() => onExamTakeCountChange("1")}
              className="h-4 w-4 accent-maroon"
              required={requiresLicensureDetails}
            />
            <span>1</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="examTakeCount"
              checked={examTakeCount === "2"}
              onChange={() => onExamTakeCountChange("2")}
              className="h-4 w-4 accent-maroon"
              required={requiresLicensureDetails}
            />
            <span>2</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="examTakeCount"
              checked={examTakeCount === "3 or more"}
              onChange={() => onExamTakeCountChange("3 or more")}
              className="h-4 w-4 accent-maroon"
              required={requiresLicensureDetails}
            />
            <span>3 or more</span>
          </label>
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
