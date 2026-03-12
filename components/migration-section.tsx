"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function MigrationSection() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">International Career Path & Migration</h2>
        <p className="text-sm text-muted-foreground">Share information about international nursing opportunities and career plans</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interest-abroad">Are you interested in working abroad as a nurse? *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="already-working">Already working abroad</SelectItem>
                <SelectItem value="actively-applying">Yes, actively applying</SelectItem>
                <SelectItem value="planning">Yes, planning to apply soon</SelectItem>
                <SelectItem value="maybe">Maybe, haven't decided</SelectItem>
                <SelectItem value="no-interest">No interest in working abroad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-countries">Target country/countries for work (if applicable)</Label>
            <Textarea
              id="target-countries"
              placeholder="List countries you're interested in, e.g., USA, UK, Canada, Australia, Middle East, etc."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>International exams or licenses you have passed/completed:</Label>
            <div className="space-y-2">
              {[
                { id: "nclex", label: "NCLEX (USA)" },
                { id: "uk-osce", label: "UK OSCE/CBT" },
                { id: "ielts", label: "IELTS" },
                { id: "toefl", label: "TOEFL" },
                { id: "oet", label: "OET (Occupational English Test)" },
                { id: "celpip", label: "CELPIP (Canada)" },
                { id: "other-lang", label: "Other language test" },
              ].map((exam) => (
                <div key={exam.id} className="flex items-center gap-2">
                  <input type="checkbox" id={exam.id} className="rounded" />
                  <Label htmlFor={exam.id} className="font-normal">
                    {exam.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="application-stage">Current stage in international job application process:</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not yet started</SelectItem>
                <SelectItem value="gathering-documents">Gathering documents and credentials</SelectItem>
                <SelectItem value="exam-prep">Preparing for required exams</SelectItem>
                <SelectItem value="applying">Actively applying to positions</SelectItem>
                <SelectItem value="interviews">Interviews/assessment stage</SelectItem>
                <SelectItem value="visa">Visa processing stage</SelectItem>
                <SelectItem value="offer-accepted">Job offer accepted, arranging transfer</SelectItem>
                <SelectItem value="already-abroad">Already working abroad</SelectItem>
                <SelectItem value="not-pursuing">Not pursuing at this time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currently-abroad">Are you currently working abroad?</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="abroad-country">If working abroad, in which country?</Label>
            <Input id="abroad-country" placeholder="Country name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abroad-years">Year you started working abroad (if applicable):</Label>
            <Input id="abroad-years" type="number" placeholder="e.g., 2022" min="2000" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="migration-reasons">Why are you interested in/pursuing international nursing work?</Label>
            <Textarea
              id="migration-reasons"
              placeholder="Share your motivations, e.g., better opportunities, experience, salary, family reasons, etc."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenges">What challenges have you faced (or anticipate) in pursuing international nursing?</Label>
            <Textarea
              id="challenges"
              placeholder="Share any barriers or difficulties, e.g., visa issues, exam preparation, credential recognition, etc."
              rows={3}
            />
          </div>
        </div>

        <Button className="w-full bg-maroon text-gold hover:bg-maroon/90">Save International Career Information</Button>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-maroon/5 to-gold/5">
        <h3 className="text-lg font-semibold text-foreground mb-2">Your feedback helps us</h3>
        <p className="text-sm text-muted-foreground">
          Understanding the international career paths and challenges of our nursing graduates helps us improve our 
          program and better prepare future students for global nursing opportunities. Thank you for sharing your experience!
        </p>
      </Card>
    </div>
  )
}
