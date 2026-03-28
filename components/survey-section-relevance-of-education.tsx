import type React from "react"

import { Button } from "@/components/ui/button"

import { Checkbox } from "@/components/ui/checkbox"

type RelevanceSkillField =
  | "clinicalSkills"
  | "criticalThinking"
  | "communicationSkills"
  | "leadership"
  | "patientCare"
  | "teamwork"
  | "problemSolving"

interface RelevanceSkillsState {
  clinicalSkills: boolean
  criticalThinking: boolean
  communicationSkills: boolean
  leadership: boolean
  patientCare: boolean
  teamwork: boolean
  problemSolving: boolean
}

interface SurveySectionRelevanceOfEducationProps {
  relevanceSkills: RelevanceSkillsState
  onRelevanceSkillChange: (field: RelevanceSkillField, checked: boolean) => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function SurveySectionRelevanceOfEducation({
  relevanceSkills,
  onRelevanceSkillChange,
  onBack,
  onSubmit,
}: SurveySectionRelevanceOfEducationProps) {
  const relevanceSkillOptions: Array<{ field: RelevanceSkillField; label: string }> = [
    { field: "clinicalSkills", label: "Clinical skills" },
    { field: "criticalThinking", label: "Critical thinking" },
    { field: "communicationSkills", label: "Communication skills" },
    { field: "leadership", label: "Leadership" },
    { field: "patientCare", label: "Patient care" },
    { field: "teamwork", label: "Teamwork" },
    { field: "problemSolving", label: "Problem-solving" },
  ]


  const handleCheckboxChange = (field: RelevanceSkillField) => (checked: boolean) => {
    onRelevanceSkillChange(field, checked)
  }

  return (
    <>
      <div className="mb-4 rounded-lg border border-maroon/20 p-5">
        <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon mb-3">Section 9 of 12</div>
        <h2 className="text-2xl font-bold text-maroon">Section VII: Relevance of Education</h2>
        <p className="mt-2 text-sm text-muted-foreground">Description (optional)</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">Skills learned in college that helped you in employment</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {relevanceSkillOptions.map((option, idx) => (
              <label key={option.field} htmlFor={`relevance-skill-${option.field}`} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={relevanceSkills[option.field]}
                  onCheckedChange={handleCheckboxChange(option.field)}
                  id={`relevance-skill-${option.field}`}
                />
                {option.label}
              </label>
            ))}
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