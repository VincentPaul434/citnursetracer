import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SurveySectionIntroProps {
  email: string
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onContinue: (e: React.FormEvent) => void
}

export default function SurveySectionIntro({ email, onEmailChange, onContinue }: SurveySectionIntroProps) {
  return (
    <>
      <div className="mb-6">
        <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon mb-4">Section 1 of 12</div>
        <h2 className="text-4xl font-bold text-maroon mb-4">Tracking Nursing Graduates Through Innovation</h2>
        <div className="space-y-4 text-base text-foreground leading-relaxed">
          <p>Greetings!</p>
          <p>
            We are student nurses from <strong>Cebu Institute of Technology - University (CIT-U)</strong> conducting a survey
            entitled <span className="font-semibold">&quot;Tracking Nursing Graduates Through Innovation&quot;</span>. We kindly
            invite you to take a few minutes of your time to answer this form. Your participation will greatly contribute
            to helping us gather valuable information that may support future improvements and innovations in alumni
            tracking. Rest assured that <strong>all responses will be kept strictly confidential</strong> and <strong>will
            be used for academic purposes only</strong>. Your time and cooperation are highly appreciated. Thank you for
            supporting our study!
          </p>
        </div>
      </div>

      <form onSubmit={onContinue} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Short answer text"
            value={email}
            onChange={onEmailChange}
            className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
            required
          />
        </div>

        <div className="pt-2">
          <Button type="submit" className="bg-gold text-maroon hover:bg-gold/90 font-semibold px-8">
            Continue
          </Button>
        </div>
      </form>
    </>
  )
}
