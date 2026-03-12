"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function CompetencySection() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Program Feedback & Competency Assessment</h2>
        <p className="text-sm text-muted-foreground">Help us improve our nursing program with your valuable feedback</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>How well did the RLE (Related Learning Experience) prepare you for actual work? *</Label>
            <div className="flex gap-2 flex-wrap">
              {["Poor", "Fair", "Good", "Very Good", "Excellent"].map((option) => (
                <button
                  key={option}
                  className="flex-1 min-w-fit p-2 text-xs border border-border rounded-lg hover:bg-maroon hover:text-gold transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Rate your competence in these nursing areas: (1 = Not Competent, 5 = Highly Competent)</h3>
            <div className="space-y-3">
              {[
                "Patient assessment and monitoring",
                "Patient care and nursing interventions",
                "Communication with patients and colleagues",
                "Critical thinking and problem-solving",
                "Professional ethics and standards",
                "Time management and organization",
                "Technical nursing skills",
                "Documentation and record-keeping",
              ].map((competency) => (
                <div key={competency} className="flex items-center justify-between">
                  <Label className="text-sm flex-1">{competency}</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        className="w-8 h-8 rounded-full border border-maroon/30 hover:bg-maroon hover:text-gold transition-colors text-sm font-semibold"
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="most-helpful">What courses or topics from the program helped you most in your job?</Label>
              <Textarea
                id="most-helpful"
                placeholder="Share which subjects or topics were most valuable in your professional practice..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="improvement-areas">What areas or skills do you wish were covered more in the program?</Label>
              <Textarea
                id="improvement-areas"
                placeholder="Suggest areas where more emphasis or training would be beneficial..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional-skills">What new skills or knowledge should be added to the nursing curriculum?</Label>
              <Textarea
                id="additional-skills"
                placeholder="Recommend new topics, skills, or competencies for future students..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="general-feedback">Additional comments or suggestions for program improvement</Label>
              <Textarea
                id="general-feedback"
                placeholder="Share any other feedback or suggestions..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <Button className="w-full bg-maroon text-gold hover:bg-maroon/90">Submit Feedback</Button>
      </Card>
    </div>
  )
}
