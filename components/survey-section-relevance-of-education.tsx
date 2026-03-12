import type React from "react"

import { Button } from "@/components/ui/button"

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

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={relevanceSkills.clinicalSkills}
              onChange={(e) => onRelevanceSkillChange("clinicalSkills", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Clinical skills</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={relevanceSkills.criticalThinking}
              onChange={(e) => onRelevanceSkillChange("criticalThinking", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Critical thinking</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={relevanceSkills.communicationSkills}
              onChange={(e) => onRelevanceSkillChange("communicationSkills", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Communication skills</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={relevanceSkills.leadership}
              onChange={(e) => onRelevanceSkillChange("leadership", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Leadership</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={relevanceSkills.patientCare}
              onChange={(e) => onRelevanceSkillChange("patientCare", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Patient care</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={relevanceSkills.teamwork}
              onChange={(e) => onRelevanceSkillChange("teamwork", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Teamwork</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={relevanceSkills.problemSolving}
              onChange={(e) => onRelevanceSkillChange("problemSolving", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Problem-solving</span>
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