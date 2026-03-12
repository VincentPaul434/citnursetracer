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

const genderOptions: GenderOption[] = ["Male", "Female", "Prefer not to say", "Other"]
const civilStatusOptions: CivilStatusOption[] = ["Single", "Married", "Widowed", "Other"]

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
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-foreground">1. Name & Identification</h3>
          <div className="rounded-md border border-maroon/15 bg-muted/40 p-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  1.1 Name <span className="text-maroon">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={onTextChange}
                  className="bg-white text-foreground border-maroon/25 placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="contactInformation" className="text-sm font-medium text-foreground">
                  1.2 Phone <span className="text-maroon">*</span>
                </Label>
                <Input
                  id="contactInformation"
                  type="text"
                  placeholder="Enter your phone number"
                  value={contactInformation}
                  onChange={onTextChange}
                  className="bg-white text-foreground border-maroon/25 placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-foreground">2. Address</h3>
          <div className="rounded-md border border-maroon/15 bg-muted/40 p-3">
            <div className="space-y-1">
              <Label htmlFor="residence" className="text-sm font-medium text-foreground">
                2.1 Current Place of Residence <span className="text-maroon">*</span>
              </Label>
              <Input
                id="residence"
                type="text"
                placeholder="City / Province"
                value={residence}
                onChange={onTextChange}
                className="bg-white text-foreground border-maroon/25 placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-foreground">3. Civil Status, Gender, and Birthday</h3>
          <div className="rounded-md border border-maroon/15 bg-muted/40 p-3 space-y-3">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="civilStatusSelect" className="text-sm font-medium text-foreground">
                  3.1 Civil Status <span className="text-maroon">*</span>
                </Label>
                <select
                  id="civilStatusSelect"
                  value={civilStatus}
                  onChange={(e) => onCivilStatusChange(e.target.value as CivilStatusOption)}
                  className="h-10 w-full rounded-md border border-maroon/25 bg-white px-3 text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  required
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  {civilStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="genderSelect" className="text-sm font-medium text-foreground">
                  3.2 Gender <span className="text-maroon">*</span>
                </Label>
                <select
                  id="genderSelect"
                  value={gender}
                  onChange={(e) => onGenderChange(e.target.value as GenderOption)}
                  className="h-10 w-full rounded-md border border-maroon/25 bg-white px-3 text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="birthday" className="text-sm font-medium text-foreground">
                  3.3 Birthday <span className="text-maroon">*</span>
                </Label>
                <Input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={onTextChange}
                  className="bg-white text-foreground border-maroon/25"
                  required
                />
              </div>
            </div>

            {(civilStatus === "Other" || gender === "Other") && (
              <div className="grid gap-3 md:grid-cols-2">
                {civilStatus === "Other" && (
                  <div className="space-y-1">
                    <Label htmlFor="civilStatusOther" className="text-sm font-medium text-foreground">
                      Other Civil Status <span className="text-maroon">*</span>
                    </Label>
                    <Input
                      id="civilStatusOther"
                      type="text"
                      value={civilStatusOther}
                      onChange={onTextChange}
                      className="bg-white text-foreground border-maroon/25 placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                )}

                {gender === "Other" && (
                  <div className="space-y-1">
                    <Label htmlFor="genderOther" className="text-sm font-medium text-foreground">
                      Other Gender <span className="text-maroon">*</span>
                    </Label>
                    <Input
                      id="genderOther"
                      type="text"
                      value={genderOther}
                      onChange={onTextChange}
                      className="bg-white text-foreground border-maroon/25 placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                )}
              </div>
            )}
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