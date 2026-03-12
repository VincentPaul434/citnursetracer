import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type HonorField = "cumLaude" | "magnaCumLaude" | "summaCumLaude" | "none" | "other"

interface AcademicHonorsState {
  cumLaude: boolean
  magnaCumLaude: boolean
  summaCumLaude: boolean
  none: boolean
  other: boolean
}

interface SurveySectionEducationalBackgroundProps {
  degreeProgramCompleted: string
  yearGraduated: string
  yearGraduatedOther: string
  academicHonors: AcademicHonorsState
  academicHonorsOtherText: string
  pursuedFurtherStudies: string
  furtherDegreeProgram: string
  honorsError: string
  onDegreeProgramChange: (value: string) => void
  onYearGraduatedChange: (value: string) => void
  onHonorChange: (field: HonorField, checked: boolean) => void
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFurtherStudiesChange: (value: "Yes" | "No") => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function SurveySectionEducationalBackground({
  degreeProgramCompleted,
  yearGraduated,
  yearGraduatedOther,
  academicHonors,
  academicHonorsOtherText,
  pursuedFurtherStudies,
  furtherDegreeProgram,
  honorsError,
  onDegreeProgramChange,
  onYearGraduatedChange,
  onHonorChange,
  onTextChange,
  onFurtherStudiesChange,
  onBack,
  onSubmit,
}: SurveySectionEducationalBackgroundProps) {
  return (
    <>
      <div className="mb-4 rounded-lg border border-maroon/20 p-5">
        <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon mb-3">Section 4 of 12</div>
        <h2 className="text-2xl font-bold text-maroon">Section II. Educational Background</h2>
        <p className="mt-2 text-sm text-muted-foreground">Description (optional)</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Degree Program Completed <span className="text-maroon">*</span>
          </p>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="degreeProgramCompleted"
              checked={degreeProgramCompleted === "Bachelor of Science in Nursing"}
              onChange={() => onDegreeProgramChange("Bachelor of Science in Nursing")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>Bachelor of Science in Nursing</span>
          </label>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Year Graduate from CIT-U <span className="text-maroon">*</span>
          </p>

          {[
            "2020",
            "2021",
            "2022",
            "2023",
            "2024",
            "2025",
          ].map((year) => (
            <label key={year} className="flex items-center gap-3 text-foreground cursor-pointer">
              <input
                type="radio"
                name="yearGraduated"
                checked={yearGraduated === year}
                onChange={() => onYearGraduatedChange(year)}
                className="h-4 w-4 accent-maroon"
                required
              />
              <span>{year}</span>
            </label>
          ))}

          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="yearGraduated"
              checked={yearGraduated === "Other"}
              onChange={() => onYearGraduatedChange("Other")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <Label htmlFor="yearGraduatedOther" className="text-foreground text-sm">
              Other:
            </Label>
            <Input
              id="yearGraduatedOther"
              type="text"
              value={yearGraduatedOther}
              onChange={onTextChange}
              className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
              required={yearGraduated === "Other"}
            />
          </div>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Academic Honor Received (if any) <span className="text-maroon">*</span>
          </p>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={academicHonors.cumLaude}
              onChange={(e) => onHonorChange("cumLaude", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Cum Laude</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={academicHonors.magnaCumLaude}
              onChange={(e) => onHonorChange("magnaCumLaude", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Magna Cum Laude</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={academicHonors.summaCumLaude}
              onChange={(e) => onHonorChange("summaCumLaude", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Summa Cum Laude</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={academicHonors.none}
              onChange={(e) => onHonorChange("none", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>None</span>
          </label>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={academicHonors.other}
              onChange={(e) => onHonorChange("other", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <Label htmlFor="academicHonorsOtherText" className="text-foreground text-sm">
              Other:
            </Label>
            <Input
              id="academicHonorsOtherText"
              type="text"
              value={academicHonorsOtherText}
              onChange={onTextChange}
              className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
              required={academicHonors.other}
            />
          </div>

          {honorsError && <p className="text-sm text-maroon font-medium">{honorsError}</p>}
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Did you pursue further studies? <span className="text-maroon">*</span>
          </p>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="pursuedFurtherStudies"
              checked={pursuedFurtherStudies === "Yes"}
              onChange={() => onFurtherStudiesChange("Yes")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>Yes</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="pursuedFurtherStudies"
              checked={pursuedFurtherStudies === "No"}
              onChange={() => onFurtherStudiesChange("No")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>No</span>
          </label>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-2">
          <Label htmlFor="furtherDegreeProgram" className="text-foreground text-base">
            If yes, what degree or program? <span className="text-maroon">*</span>
          </Label>
          <Input
            id="furtherDegreeProgram"
            type="text"
            placeholder="Short answer text"
            value={furtherDegreeProgram}
            onChange={onTextChange}
            className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
            required={pursuedFurtherStudies === "Yes"}
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
