import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FirstJobSourceField =
  | "jobFairs"
  | "schoolPlacementOffice"
  | "onlineJobPortal"
  | "recommendationFromFriendsRelatives"
  | "walkInApplication"
  | "other"

interface FirstJobSourcesState {
  jobFairs: boolean
  schoolPlacementOffice: boolean
  onlineJobPortal: boolean
  recommendationFromFriendsRelatives: boolean
  walkInApplication: boolean
  other: boolean
}

interface SurveySectionEmploymentInformationProps {
  jobRelatedToDegree: string
  employmentSector: string
  employmentSectorOther: string
  positionDesignation: string
  positionDesignationOther: string
  firstJobDuration: string
  firstJobSources: FirstJobSourcesState
  firstJobSourceOtherText: string
  estimatedMonthlySalary: string
  firstJobSourceError: string
  onJobRelatedToDegreeChange: (value: "Yes" | "No") => void
  onEmploymentSectorChange: (
    value: "Government Hospital" | "Private Hospital" | "Clinic" | "Community Health Center" | "Non-healthcare related" | "Abroad" | "Other",
  ) => void
  onPositionDesignationChange: (
    value: "Staff Nurse" | "Nurse Trainee" | "Private Duty Nurse" | "Nursing Assistant" | "Other",
  ) => void
  onFirstJobDurationChange: (value: "Less than 3 months" | "3-6 months" | "6-12 months" | "More than 1 year") => void
  onFirstJobSourceChange: (field: FirstJobSourceField, checked: boolean) => void
  onEstimatedMonthlySalaryChange: (
    value: "Below ₱10,000" | "₱10,000–₱20,000" | "₱20,001–₱30,000" | "₱30,001–₱40,000" | "₱40,001 and above",
  ) => void
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function SurveySectionEmploymentInformation({
  jobRelatedToDegree,
  employmentSector,
  employmentSectorOther,
  positionDesignation,
  positionDesignationOther,
  firstJobDuration,
  firstJobSources,
  firstJobSourceOtherText,
  estimatedMonthlySalary,
  firstJobSourceError,
  onJobRelatedToDegreeChange,
  onEmploymentSectorChange,
  onPositionDesignationChange,
  onFirstJobDurationChange,
  onFirstJobSourceChange,
  onEstimatedMonthlySalaryChange,
  onTextChange,
  onBack,
  onSubmit,
}: SurveySectionEmploymentInformationProps) {
  return (
    <>
      <div className="mb-4 rounded-lg border border-maroon/20 p-5">
        <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon mb-3">Section 7 of 12</div>
        <h2 className="text-2xl font-bold text-maroon">Section V. Employment Information (For Employed Graduates)</h2>
        <p className="mt-2 text-sm text-muted-foreground">Description (optional)</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Is your current job related to your degree? <span className="text-maroon">*</span>
          </p>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="jobRelatedToDegree"
              checked={jobRelatedToDegree === "Yes"}
              onChange={() => onJobRelatedToDegreeChange("Yes")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>Yes</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="jobRelatedToDegree"
              checked={jobRelatedToDegree === "No"}
              onChange={() => onJobRelatedToDegreeChange("No")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>No</span>
          </label>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Employment Sector <span className="text-maroon">*</span>
          </p>

          {[
            "Government Hospital",
            "Private Hospital",
            "Clinic",
            "Community Health Center",
            "Non-healthcare related",
            "Abroad",
          ].map((option) => (
            <label key={option} className="flex items-center gap-3 text-foreground cursor-pointer">
              <input
                type="radio"
                name="employmentSector"
                checked={employmentSector === option}
                onChange={() => onEmploymentSectorChange(option as "Government Hospital" | "Private Hospital" | "Clinic" | "Community Health Center" | "Non-healthcare related" | "Abroad")}
                className="h-4 w-4 accent-maroon"
                required
              />
              <span>{option}</span>
            </label>
          ))}

          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="employmentSector"
              checked={employmentSector === "Other"}
              onChange={() => onEmploymentSectorChange("Other")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <Label htmlFor="employmentSectorOther" className="text-foreground text-sm">
              Other:
            </Label>
            <Input
              id="employmentSectorOther"
              type="text"
              value={employmentSectorOther}
              onChange={onTextChange}
              className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
              required={employmentSector === "Other"}
            />
          </div>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Position/Designation <span className="text-maroon">*</span>
          </p>

          {[
            "Staff Nurse",
            "Nurse Trainee",
            "Private Duty Nurse",
            "Nursing Assistant",
          ].map((option) => (
            <label key={option} className="flex items-center gap-3 text-foreground cursor-pointer">
              <input
                type="radio"
                name="positionDesignation"
                checked={positionDesignation === option}
                onChange={() => onPositionDesignationChange(option as "Staff Nurse" | "Nurse Trainee" | "Private Duty Nurse" | "Nursing Assistant")}
                className="h-4 w-4 accent-maroon"
                required
              />
              <span>{option}</span>
            </label>
          ))}

          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="positionDesignation"
              checked={positionDesignation === "Other"}
              onChange={() => onPositionDesignationChange("Other")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <Label htmlFor="positionDesignationOther" className="text-foreground text-sm">
              Other:
            </Label>
            <Input
              id="positionDesignationOther"
              type="text"
              value={positionDesignationOther}
              onChange={onTextChange}
              className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
              required={positionDesignation === "Other"}
            />
          </div>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            How long did it take you to get your first job after graduation? <span className="text-maroon">*</span>
          </p>

          {[
            "Less than 3 months",
            "3-6 months",
            "6-12 months",
            "More than 1 year",
          ].map((option) => (
            <label key={option} className="flex items-center gap-3 text-foreground cursor-pointer">
              <input
                type="radio"
                name="firstJobDuration"
                checked={firstJobDuration === option}
                onChange={() => onFirstJobDurationChange(option as "Less than 3 months" | "3-6 months" | "6-12 months" | "More than 1 year")}
                className="h-4 w-4 accent-maroon"
                required
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            How did you find your first job? <span className="text-maroon">*</span>
          </p>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={firstJobSources.jobFairs}
              onChange={(e) => onFirstJobSourceChange("jobFairs", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Job fairs</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={firstJobSources.schoolPlacementOffice}
              onChange={(e) => onFirstJobSourceChange("schoolPlacementOffice", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>School placement office</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={firstJobSources.onlineJobPortal}
              onChange={(e) => onFirstJobSourceChange("onlineJobPortal", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Online job portal</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={firstJobSources.recommendationFromFriendsRelatives}
              onChange={(e) => onFirstJobSourceChange("recommendationFromFriendsRelatives", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Recommendation from friends/relatives</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={firstJobSources.walkInApplication}
              onChange={(e) => onFirstJobSourceChange("walkInApplication", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Walk-in application</span>
          </label>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={firstJobSources.other}
              onChange={(e) => onFirstJobSourceChange("other", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <Label htmlFor="firstJobSourceOtherText" className="text-foreground text-sm">
              Other:
            </Label>
            <Input
              id="firstJobSourceOtherText"
              type="text"
              value={firstJobSourceOtherText}
              onChange={onTextChange}
              className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
              required={firstJobSources.other}
            />
          </div>

          {firstJobSourceError && <p className="text-sm text-maroon font-medium">{firstJobSourceError}</p>}
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Estimated Monthly Salary <span className="text-maroon">*</span>
          </p>

          {[
            "Below ₱10,000",
            "₱10,000–₱20,000",
            "₱20,001–₱30,000",
            "₱30,001–₱40,000",
            "₱40,001 and above",
          ].map((option) => (
            <label key={option} className="flex items-center gap-3 text-foreground cursor-pointer">
              <input
                type="radio"
                name="estimatedMonthlySalary"
                checked={estimatedMonthlySalary === option}
                onChange={() =>
                  onEstimatedMonthlySalaryChange(
                    option as "Below ₱10,000" | "₱10,000–₱20,000" | "₱20,001–₱30,000" | "₱30,001–₱40,000" | "₱40,001 and above",
                  )
                }
                className="h-4 w-4 accent-maroon"
                required
              />
              <span>{option}</span>
            </label>
          ))}
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
