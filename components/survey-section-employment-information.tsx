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
  const firstJobSourceOptions: Array<{ field: FirstJobSourceField; label: string }> = [
    { field: "jobFairs", label: "Job fairs" },
    { field: "schoolPlacementOffice", label: "School placement office" },
    { field: "onlineJobPortal", label: "Online job portal" },
    { field: "recommendationFromFriendsRelatives", label: "Recommendation from friends/relatives" },
    { field: "walkInApplication", label: "Walk-in application" },
    { field: "other", label: "Other" },
  ]

  const selectedFirstJobSource = firstJobSourceOptions.find(({ field }) => firstJobSources[field])?.field

  const handleFirstJobSourceSelectChange = (value: string) => {
    const selectedField = value as FirstJobSourceField

    firstJobSourceOptions.forEach(({ field }) => {
      onFirstJobSourceChange(field, field === selectedField)
    })
  }

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

          <Select value={jobRelatedToDegree || undefined} onValueChange={(value) => onJobRelatedToDegreeChange(value as "Yes" | "No")}>
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Employment Sector <span className="text-maroon">*</span>
          </p>

          <Select
            value={employmentSector || undefined}
            onValueChange={(value) =>
              onEmploymentSectorChange(
                value as
                  | "Government Hospital"
                  | "Private Hospital"
                  | "Clinic"
                  | "Community Health Center"
                  | "Non-healthcare related"
                  | "Abroad"
                  | "Other",
              )
            }
          >
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder="Select employment sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Government Hospital">Government Hospital</SelectItem>
              <SelectItem value="Private Hospital">Private Hospital</SelectItem>
              <SelectItem value="Clinic">Clinic</SelectItem>
              <SelectItem value="Community Health Center">Community Health Center</SelectItem>
              <SelectItem value="Non-healthcare related">Non-healthcare related</SelectItem>
              <SelectItem value="Abroad">Abroad</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          {employmentSector === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="employmentSectorOther" className="text-foreground text-sm">
                Please specify
              </Label>
              <Input
                id="employmentSectorOther"
                type="text"
                value={employmentSectorOther}
                onChange={onTextChange}
                className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
                required
              />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Position/Designation <span className="text-maroon">*</span>
          </p>

          <Select
            value={positionDesignation || undefined}
            onValueChange={(value) =>
              onPositionDesignationChange(value as "Staff Nurse" | "Nurse Trainee" | "Private Duty Nurse" | "Nursing Assistant" | "Other")
            }
          >
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder="Select position/designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Staff Nurse">Staff Nurse</SelectItem>
              <SelectItem value="Nurse Trainee">Nurse Trainee</SelectItem>
              <SelectItem value="Private Duty Nurse">Private Duty Nurse</SelectItem>
              <SelectItem value="Nursing Assistant">Nursing Assistant</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          {positionDesignation === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="positionDesignationOther" className="text-foreground text-sm">
                Please specify
              </Label>
              <Input
                id="positionDesignationOther"
                type="text"
                value={positionDesignationOther}
                onChange={onTextChange}
                className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
                required
              />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            How long did it take you to get your first job after graduation? <span className="text-maroon">*</span>
          </p>

          <Select
            value={firstJobDuration || undefined}
            onValueChange={(value) => onFirstJobDurationChange(value as "Less than 3 months" | "3-6 months" | "6-12 months" | "More than 1 year")}
          >
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Less than 3 months">Less than 3 months</SelectItem>
              <SelectItem value="3-6 months">3-6 months</SelectItem>
              <SelectItem value="6-12 months">6-12 months</SelectItem>
              <SelectItem value="More than 1 year">More than 1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            How did you find your first job? <span className="text-maroon">*</span>
          </p>

          <Select value={selectedFirstJobSource} onValueChange={handleFirstJobSourceSelectChange}>
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder="Select first job source" />
            </SelectTrigger>
            <SelectContent>
              {firstJobSourceOptions.map((option) => (
                <SelectItem key={option.field} value={option.field}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {firstJobSources.other && (
            <div className="space-y-2">
              <Label htmlFor="firstJobSourceOtherText" className="text-foreground text-sm">
                Please specify
              </Label>
              <Input
                id="firstJobSourceOtherText"
                type="text"
                value={firstJobSourceOtherText}
                onChange={onTextChange}
                className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
                required
              />
            </div>
          )}

          {firstJobSourceError && <p className="text-sm text-maroon font-medium">{firstJobSourceError}</p>}
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Estimated Monthly Salary <span className="text-maroon">*</span>
          </p>

          <Select
            value={estimatedMonthlySalary || undefined}
            onValueChange={(value) =>
              onEstimatedMonthlySalaryChange(
                value as "Below ₱10,000" | "₱10,000–₱20,000" | "₱20,001–₱30,000" | "₱30,001–₱40,000" | "₱40,001 and above",
              )
            }
          >
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder="Select salary range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Below ₱10,000">Below ₱10,000</SelectItem>
              <SelectItem value="₱10,000–₱20,000">₱10,000–₱20,000</SelectItem>
              <SelectItem value="₱20,001–₱30,000">₱20,001–₱30,000</SelectItem>
              <SelectItem value="₱30,001–₱40,000">₱30,001–₱40,000</SelectItem>
              <SelectItem value="₱40,001 and above">₱40,001 and above</SelectItem>
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
