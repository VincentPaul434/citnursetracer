import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type GenderOption = "Male" | "Female" | "Prefer not to say" | "Other"
type CivilStatusOption = "Single" | "Married" | "Widowed" | "Other"

interface SurveySectionPersonalInfoProps {
  fullName: string
  gender: string
  genderOther: string
  civilStatus: string
  civilStatusOther: string
  birthday: string
  residence: string
  contactInformation: string
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onGenderChange: (value: GenderOption) => void
  onCivilStatusChange: (value: CivilStatusOption) => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function SurveySectionPersonalInfo({
  fullName,
  gender,
  genderOther,
  civilStatus,
  civilStatusOther,
  birthday,
  residence,
  contactInformation,
  onTextChange,
  onGenderChange,
  onCivilStatusChange,
  onBack,
  onSubmit,
}: SurveySectionPersonalInfoProps) {
  return (
    <>
      <div className="mb-4 rounded-lg border border-maroon/20 p-5">
        <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon mb-3">Section 3 of 12</div>
        <h2 className="text-2xl font-bold text-maroon">Section I. Personal Information</h2>
        <p className="mt-2 italic text-sm text-muted-foreground">(This section gathers general background information about the graduate.)</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="rounded-lg border border-maroon/20 p-5 space-y-2">
          <Label htmlFor="fullName" className="text-foreground text-base">
            Full Name <span className="text-maroon">*</span>
          </Label>
          <p className="text-sm text-muted-foreground">Ex. (Juan P. Dela Cruz)</p>
          <Input
            id="fullName"
            type="text"
            placeholder="Short answer text"
            value={fullName}
            onChange={onTextChange}
            className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
            required
          />
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Gender <span className="text-maroon">*</span>
          </p>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="gender"
              checked={gender === "Male"}
              onChange={() => onGenderChange("Male")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>Male</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="gender"
              checked={gender === "Female"}
              onChange={() => onGenderChange("Female")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>Female</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="gender"
              checked={gender === "Prefer not to say"}
              onChange={() => onGenderChange("Prefer not to say")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>Prefer not to say</span>
          </label>

          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="gender"
              checked={gender === "Other"}
              onChange={() => onGenderChange("Other")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <Label htmlFor="genderOther" className="text-foreground text-sm">
              Other:
            </Label>
            <Input
              id="genderOther"
              type="text"
              value={genderOther}
              onChange={onTextChange}
              className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
              required={gender === "Other"}
            />
          </div>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Civil Status <span className="text-maroon">*</span>
          </p>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="civilStatus"
              checked={civilStatus === "Single"}
              onChange={() => onCivilStatusChange("Single")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>Single</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="civilStatus"
              checked={civilStatus === "Married"}
              onChange={() => onCivilStatusChange("Married")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>Married</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="radio"
              name="civilStatus"
              checked={civilStatus === "Widowed"}
              onChange={() => onCivilStatusChange("Widowed")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <span>Widowed</span>
          </label>

          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="civilStatus"
              checked={civilStatus === "Other"}
              onChange={() => onCivilStatusChange("Other")}
              className="h-4 w-4 accent-maroon"
              required
            />
            <Label htmlFor="civilStatusOther" className="text-foreground text-sm">
              Other:
            </Label>
            <Input
              id="civilStatusOther"
              type="text"
              value={civilStatusOther}
              onChange={onTextChange}
              className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
              required={civilStatus === "Other"}
            />
          </div>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-2">
          <Label htmlFor="birthday" className="text-foreground text-base">
            Birthday <span className="text-maroon">*</span>
          </Label>
          <p className="text-sm text-muted-foreground">Month, day, year</p>
          <Input
            id="birthday"
            type="date"
            value={birthday}
            onChange={onTextChange}
            className="bg-white text-foreground border-maroon/20"
            required
          />
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-2">
          <Label htmlFor="residence" className="text-foreground text-base">
            Current Place of Residence <span className="text-maroon">*</span>
          </Label>
          <p className="text-sm text-muted-foreground">City/Province</p>
          <Input
            id="residence"
            type="text"
            placeholder="Short answer text"
            value={residence}
            onChange={onTextChange}
            className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
            required
          />
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-2">
          <Label htmlFor="contactInformation" className="text-foreground text-base">
            Contact Information <span className="text-maroon">*</span>
          </Label>
          <p className="text-sm text-muted-foreground">ex. 09XX-XXX-XXXX</p>
          <Input
            id="contactInformation"
            type="text"
            placeholder="Short answer text"
            value={contactInformation}
            onChange={onTextChange}
            className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
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
