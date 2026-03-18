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

const yearOptions = ["2020", "2021", "2022", "2023", "2024", "2025", "Other"]

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
  const isFurtherDegreeProgramEnabled = pursuedFurtherStudies === "Yes"

  return (
    <>
      <div className="mb-4 rounded-lg border border-maroon/20 p-5">
        <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon mb-3">Section 4 of 12</div>
        <h2 className="text-2xl font-bold text-maroon">Section II. Educational Background</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="rounded-lg border border-maroon/20 bg-muted/40 p-4 space-y-3">
          <h3 className="text-xl font-semibold text-foreground">1. Academic Record</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="degreeProgramCompletedSelect" className="text-foreground text-sm font-medium">
                1.1 Degree Program Completed <span className="text-maroon">*</span>
              </Label>
              <select
                id="degreeProgramCompletedSelect"
                value={degreeProgramCompleted}
                onChange={(e) => onDegreeProgramChange(e.target.value)}
                className="h-10 w-full rounded-md border border-maroon/20 bg-white px-3 text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                required
              >
                <option value="" disabled>
                  Select program
                </option>
                <option value="Bachelor of Science in Nursing">Bachelor of Science in Nursing</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="yearGraduatedSelect" className="text-foreground text-sm font-medium">
                1.2 Year Graduated from CIT-U <span className="text-maroon">*</span>
              </Label>
              <select
                id="yearGraduatedSelect"
                value={yearGraduated}
                onChange={(e) => onYearGraduatedChange(e.target.value)}
                className="h-10 w-full rounded-md border border-maroon/20 bg-white px-3 text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                required
              >
                <option value="" disabled>
                  Select year
                </option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {yearGraduated === "Other" && (
            <div className="space-y-1.5 md:max-w-sm">
              <Label htmlFor="yearGraduatedOther" className="text-foreground text-sm font-medium">
                1.3 Specify Year <span className="text-maroon">*</span>
              </Label>
              <Input
                id="yearGraduatedOther"
                type="text"
                value={yearGraduatedOther}
                onChange={onTextChange}
                className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
                required
              />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-maroon/20 bg-muted/40 p-4 space-y-3">
          <h3 className="text-xl font-semibold text-foreground">2. Academic Honors</h3>
          <p className="text-sm text-muted-foreground">You may select multiple options.</p>

          <div className="grid gap-3 md:grid-cols-2">
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
          </div>

          <div className="space-y-1.5 md:max-w-md">
            <label className="flex items-center gap-3 text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={academicHonors.other}
                onChange={(e) => onHonorChange("other", e.target.checked)}
                className="h-4 w-4 accent-maroon"
              />
              <span>Other</span>
            </label>
            <Input
              id="academicHonorsOtherText"
              type="text"
              value={academicHonorsOtherText}
              onChange={onTextChange}
              className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
              placeholder="Specify other honor"
              required={academicHonors.other}
            />
          </div>

          {honorsError && <p className="text-sm text-maroon font-medium">{honorsError}</p>}
        </div>

        <div className="rounded-lg border border-maroon/20 bg-muted/40 p-4 space-y-3">
          <h3 className="text-xl font-semibold text-foreground">3. Further Studies</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pursuedFurtherStudiesSelect" className="text-foreground text-sm font-medium">
                3.1 Did you pursue further studies? <span className="text-maroon">*</span>
              </Label>
              <select
                id="pursuedFurtherStudiesSelect"
                value={pursuedFurtherStudies}
                onChange={(e) => onFurtherStudiesChange(e.target.value as "Yes" | "No")}
                className="h-10 w-full rounded-md border border-maroon/20 bg-white px-3 text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                required
              >
                <option value="" disabled>
                  Select option
                </option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="furtherDegreeProgram"
                className={`text-sm font-medium ${isFurtherDegreeProgramEnabled ? "text-foreground" : "text-muted-foreground"}`}
              >
                3.2 If yes, what degree or program? <span className="text-maroon">*</span>
              </Label>
              <Input
                id="furtherDegreeProgram"
                type="text"
                placeholder="Short answer text"
                value={isFurtherDegreeProgramEnabled ? furtherDegreeProgram : ""}
                onChange={onTextChange}
                className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground disabled:bg-muted disabled:text-muted-foreground"
                disabled={!isFurtherDegreeProgramEnabled}
                readOnly={!isFurtherDegreeProgramEnabled}
                required={isFurtherDegreeProgramEnabled}
              />
            </div>
          </div>
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