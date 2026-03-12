import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type InvitationChannelField =
  | "email"
  | "facebookPageGroup"
  | "messenger"
  | "smsTextMessage"
  | "officialSchoolWebsite"
  | "phoneCall"
  | "other"

type UpdateFrequencyValue =
  | "Very often (every event announcement)"
  | "Occasionally (major events only)"
  | "Rarely"
  | "I prefer not to receive updates"

type AlumniGroupWillingnessValue = "Yes" | "No" | "Maybe"

type AlumniPlatformValue = "Facebook Community" | "Viber Group" | "Whats App" | "Email Newsletter" | "School Website Portal"

interface InvitationChannelsState {
  email: boolean
  facebookPageGroup: boolean
  messenger: boolean
  smsTextMessage: boolean
  officialSchoolWebsite: boolean
  phoneCall: boolean
  other: boolean
}

interface SurveySectionPreferredCommunicationEventsProps {
  invitationChannels: InvitationChannelsState
  invitationChannelOtherText: string
  invitationChannelError: string
  updateFrequency: string
  alumniGroupWillingness: string
  alumniPlatform: string
  alumniPlatformError: string
  onInvitationChannelChange: (field: InvitationChannelField, checked: boolean) => void
  onUpdateFrequencyChange: (value: UpdateFrequencyValue) => void
  onAlumniGroupWillingnessChange: (value: AlumniGroupWillingnessValue) => void
  onAlumniPlatformChange: (value: AlumniPlatformValue) => void
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function SurveySectionPreferredCommunicationEvents({
  invitationChannels,
  invitationChannelOtherText,
  invitationChannelError,
  updateFrequency,
  alumniGroupWillingness,
  alumniPlatform,
  alumniPlatformError,
  onInvitationChannelChange,
  onUpdateFrequencyChange,
  onAlumniGroupWillingnessChange,
  onAlumniPlatformChange,
  onTextChange,
  onBack,
  onSubmit,
}: SurveySectionPreferredCommunicationEventsProps) {
  const requiresAlumniPlatform = alumniGroupWillingness === "Yes"

  return (
    <>
      <div className="mb-4 rounded-lg border border-maroon/20 p-5">
        <div className="inline-flex rounded-md bg-gold px-3 py-1 text-sm font-semibold text-maroon mb-3">Section 11 of 12</div>
        <h2 className="text-2xl font-bold text-maroon">Preferred Communication for School Events</h2>
        <p className="mt-2 text-sm text-muted-foreground">Description (optional)</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            If the school will conduct an alumni event, how would you prefer to receive invitations or announcements?{" "}
            <span className="text-maroon">*</span>
          </p>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={invitationChannels.email}
              onChange={(e) => onInvitationChannelChange("email", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Email</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={invitationChannels.facebookPageGroup}
              onChange={(e) => onInvitationChannelChange("facebookPageGroup", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Facebook Page/Group</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={invitationChannels.messenger}
              onChange={(e) => onInvitationChannelChange("messenger", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Messenger</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={invitationChannels.smsTextMessage}
              onChange={(e) => onInvitationChannelChange("smsTextMessage", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>SMS/Text Message</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={invitationChannels.officialSchoolWebsite}
              onChange={(e) => onInvitationChannelChange("officialSchoolWebsite", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Official School Website</span>
          </label>

          <label className="flex items-center gap-3 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={invitationChannels.phoneCall}
              onChange={(e) => onInvitationChannelChange("phoneCall", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <span>Phone Call</span>
          </label>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={invitationChannels.other}
              onChange={(e) => onInvitationChannelChange("other", e.target.checked)}
              className="h-4 w-4 accent-maroon"
            />
            <Label htmlFor="invitationChannelOtherText" className="text-foreground text-sm">
              Other:
            </Label>
            <Input
              id="invitationChannelOtherText"
              type="text"
              value={invitationChannelOtherText}
              onChange={onTextChange}
              className="h-8 bg-transparent text-foreground border-0 border-b border-dotted border-maroon/30 rounded-none px-1 focus-visible:ring-0"
              required={invitationChannels.other}
            />
          </div>

          {invitationChannelError && <p className="text-sm text-maroon font-medium">{invitationChannelError}</p>}
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            How often would you like to receive updates about school or alumni activities? <span className="text-maroon">*</span>
          </p>

          {[
            "Very often (every event announcement)",
            "Occasionally (major events only)",
            "Rarely",
            "I prefer not to receive updates",
          ].map((option) => (
            <label key={option} className="flex items-center gap-3 text-foreground cursor-pointer">
              <input
                type="radio"
                name="updateFrequency"
                checked={updateFrequency === option}
                onChange={() =>
                  onUpdateFrequencyChange(
                    option as
                      | "Very often (every event announcement)"
                      | "Occasionally (major events only)"
                      | "Rarely"
                      | "I prefer not to receive updates",
                  )
                }
                className="h-4 w-4 accent-maroon"
                required
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Would you be willing to join an official alumni online group for updates and invitation?{" "}
            <span className="text-maroon">*</span>
          </p>

          {[
            "Yes",
            "No",
            "Maybe",
          ].map((option) => (
            <label key={option} className="flex items-center gap-3 text-foreground cursor-pointer">
              <input
                type="radio"
                name="alumniGroupWillingness"
                checked={alumniGroupWillingness === option}
                onChange={() => onAlumniGroupWillingnessChange(option as "Yes" | "No" | "Maybe")}
                className="h-4 w-4 accent-maroon"
                required
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            If yes, which platform do you prefer for the alumni community? <span className="text-maroon">*</span>
          </p>

          {[
            "Facebook Community",
            "Viber Group",
            "Whats App",
            "Email Newsletter",
            "School Website Portal",
          ].map((option) => (
            <label key={option} className="flex items-center gap-3 text-foreground cursor-pointer">
              <input
                type="radio"
                name="alumniPlatform"
                checked={alumniPlatform === option}
                onChange={() =>
                  onAlumniPlatformChange(
                    option as "Facebook Community" | "Viber Group" | "Whats App" | "Email Newsletter" | "School Website Portal",
                  )
                }
                className="h-4 w-4 accent-maroon"
                required={requiresAlumniPlatform}
              />
              <span>{option}</span>
            </label>
          ))}

          {alumniPlatformError && <p className="text-sm text-maroon font-medium">{alumniPlatformError}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" onClick={onBack} variant="secondary" className="bg-gold text-maroon hover:bg-gold/90">
            Back
          </Button>
          <Button type="submit" className="bg-gold text-maroon hover:bg-gold/90 font-semibold px-8">
            Submit Survey
          </Button>
        </div>
      </form>
    </>
  )
}