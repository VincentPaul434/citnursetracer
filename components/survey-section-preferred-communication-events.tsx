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
  const invitationChannelOptions: Array<{ field: InvitationChannelField; label: string }> = [
    { field: "email", label: "Email" },
    { field: "facebookPageGroup", label: "Facebook Page/Group" },
    { field: "messenger", label: "Messenger" },
    { field: "smsTextMessage", label: "SMS/Text Message" },
    { field: "officialSchoolWebsite", label: "Official School Website" },
    { field: "phoneCall", label: "Phone Call" },
    { field: "other", label: "Other" },
  ]

  const selectedInvitationChannel = invitationChannelOptions.find(({ field }) => invitationChannels[field])?.field

  const handleInvitationChannelSelectChange = (value: string) => {
    const selectedField = value as InvitationChannelField

    invitationChannelOptions.forEach(({ field }) => {
      onInvitationChannelChange(field, field === selectedField)
    })
  }

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

          <Select value={selectedInvitationChannel} onValueChange={handleInvitationChannelSelectChange}>
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder="Select preferred invitation channel" />
            </SelectTrigger>
            <SelectContent>
              {invitationChannelOptions.map((option) => (
                <SelectItem key={option.field} value={option.field}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {invitationChannels.other && (
            <div className="space-y-2">
              <Label htmlFor="invitationChannelOtherText" className="text-foreground text-sm">
                Please specify
              </Label>
              <Input
                id="invitationChannelOtherText"
                type="text"
                value={invitationChannelOtherText}
                onChange={onTextChange}
                className="bg-white text-foreground border-maroon/20 placeholder:text-muted-foreground"
                required
              />
            </div>
          )}

          {invitationChannelError && <p className="text-sm text-maroon font-medium">{invitationChannelError}</p>}
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            How often would you like to receive updates about school or alumni activities? <span className="text-maroon">*</span>
          </p>

          <Select
            value={updateFrequency || undefined}
            onValueChange={(value) =>
              onUpdateFrequencyChange(
                value as
                  | "Very often (every event announcement)"
                  | "Occasionally (major events only)"
                  | "Rarely"
                  | "I prefer not to receive updates",
              )
            }
          >
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder="Select update frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Very often (every event announcement)">Very often (every event announcement)</SelectItem>
              <SelectItem value="Occasionally (major events only)">Occasionally (major events only)</SelectItem>
              <SelectItem value="Rarely">Rarely</SelectItem>
              <SelectItem value="I prefer not to receive updates">I prefer not to receive updates</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            Would you be willing to join an official alumni online group for updates and invitation?{" "}
            <span className="text-maroon">*</span>
          </p>

          <Select
            value={alumniGroupWillingness || undefined}
            onValueChange={(value) => onAlumniGroupWillingnessChange(value as "Yes" | "No" | "Maybe")}
          >
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Maybe">Maybe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-maroon/20 p-5 space-y-4">
          <p className="text-base font-medium text-foreground">
            If yes, which platform do you prefer for the alumni community? <span className="text-maroon">*</span>
          </p>

          <Select
            value={alumniPlatform || undefined}
            onValueChange={(value) =>
              onAlumniPlatformChange(value as "Facebook Community" | "Viber Group" | "Whats App" | "Email Newsletter" | "School Website Portal")
            }
            disabled={!requiresAlumniPlatform}
          >
            <SelectTrigger className="w-full bg-white text-foreground border-maroon/20">
              <SelectValue placeholder={requiresAlumniPlatform ? "Select platform" : "Select Yes above to choose platform"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Facebook Community">Facebook Community</SelectItem>
              <SelectItem value="Viber Group">Viber Group</SelectItem>
              <SelectItem value="Whats App">Whats App</SelectItem>
              <SelectItem value="Email Newsletter">Email Newsletter</SelectItem>
              <SelectItem value="School Website Portal">School Website Portal</SelectItem>
            </SelectContent>
          </Select>

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