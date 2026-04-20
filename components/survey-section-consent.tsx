import type React from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

interface SurveySectionConsentProps {
  consent: string
  consentDeclined: boolean
  onConsentChange: (value: "yes" | "no") => void
  onSubmit: (e: React.FormEvent) => void
}

export default function SurveySectionConsent({
  consent,
  consentDeclined,
  onConsentChange,
  onSubmit,
}: SurveySectionConsentProps) {
  return (
    <>
      <div className="mb-6">
        <div className="relative mb-5 overflow-hidden rounded-2xl border border-maroon/20">
          <div className="relative h-52 w-full md:h-64">
            <Image
              src="/welcome page.png"
              alt="CIT-U welcome banner"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-maroon/85 via-maroon/60 to-maroon/20" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-2xl space-y-2 px-4 py-5 text-white md:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">CIT-U Nursing Alumni Tracer</p>
              <h2 className="text-2xl font-black leading-tight md:text-4xl">Lead The Future Through Graduate Impact</h2>
              <p className="text-sm text-white/90 md:text-base">
                Your voice helps shape stronger nursing education, alumni services, and career pathways for future CIT-U graduates.
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon mb-4">Step 1: Consent</div>
        <div className="rounded-lg border border-maroon/20 p-5 space-y-5">
          <h2 className="text-3xl font-bold text-maroon">Data Privacy and Informed Consent Statement</h2>
          <p className="italic text-foreground">(In accordance with the Data Privacy Act of 2012 – Republic Act No. 10173)</p>

          <p className="text-foreground leading-relaxed">
            All information that you provide in this survey will be treated with the <strong>highest level of confidentiality</strong> in
            accordance with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong>.
          </p>

          <p className="text-foreground leading-relaxed">
            This study will collect information from participants that <strong>does not include personally identifiable details</strong> that could
            directly reveal the identity of individual respondents. The information you provide will be used solely for <strong>academic research purposes</strong> related to the
            study entitled <strong>“Tracking Nursing Graduates through Innovation.”</strong> Your responses will <strong>not be disclosed, shared, or used by individuals outside the research team.</strong>
          </p>

          <p className="text-foreground leading-relaxed">
            The research team will handle all collected data within <strong>controlled and secure systems</strong> to ensure the protection,
            storage, and proper analysis of information while preventing any <strong>unauthorized access to the data</strong>.
          </p>

          <p className="text-foreground leading-relaxed">
            Your participation in this survey is <strong>completely voluntary</strong>. You have the right to <strong>decline participation,
            skip any question, or withdraw from the survey at any time without any penalty or consequence</strong>.
          </p>

          <p className="text-foreground leading-relaxed">
            The results of this study will be presented only in <strong>aggregated form</strong>, ensuring that <strong>no individual participant
            will be identified</strong> in any report or publication.
          </p>

          <p className="text-foreground leading-relaxed">
            By proceeding with this survey, you <strong>confirm that you have read and understood this statement and that you voluntarily agree
            to participate in this study and allow your responses to be used for research purposes.</strong>
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="rounded-lg border border-maroon/20 p-5 space-y-4">
        <p className="text-lg font-medium text-foreground">
          Do you agree to participate in this survey? <span className="text-maroon">*</span>
        </p>

        <label className="flex items-center gap-3 text-foreground cursor-pointer">
          <input
            type="radio"
            name="consent"
            checked={consent === "yes"}
            onChange={() => onConsentChange("yes")}
            className="h-4 w-4 accent-maroon"
            required
          />
          <span>Yes, I voluntarily agree to participate</span>
        </label>

        <label className="flex items-center gap-3 text-foreground cursor-pointer">
          <input
            type="radio"
            name="consent"
            checked={consent === "no"}
            onChange={() => onConsentChange("no")}
            className="h-4 w-4 accent-maroon"
            required
          />
          <span>No, I do not agree</span>
        </label>

        {consentDeclined && (
          <p className="text-sm text-maroon font-medium">You selected “No, I do not agree”. You cannot proceed without consent.</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="bg-gold text-maroon hover:bg-gold/90 font-semibold px-8">
            Continue
          </Button>
        </div>
      </form>
    </>
  )
}
