"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function CPDSection() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Professional Development & Training</h2>
        <p className="text-sm text-muted-foreground">Track your CPD activities, certifications, and career development</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cpd-units">Total CPD Units Completed (to date)</Label>
            <Input id="cpd-units" type="number" placeholder="e.g., 45" min="0" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Current Nursing Specialization (if any)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select specialization or area of focus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medical-surgical">Medical-Surgical Nursing</SelectItem>
                <SelectItem value="icu">Intensive Care Unit (ICU)</SelectItem>
                <SelectItem value="emergency">Emergency and Trauma Nursing</SelectItem>
                <SelectItem value="pediatric">Pediatric Nursing</SelectItem>
                <SelectItem value="maternity">Maternity and Women's Health</SelectItem>
                <SelectItem value="mental-health">Mental Health Nursing</SelectItem>
                <SelectItem value="community">Community Health Nursing</SelectItem>
                <SelectItem value="operating-room">Operating Room Nursing</SelectItem>
                <SelectItem value="dialysis">Dialysis/Renal Nursing</SelectItem>
                <SelectItem value="oncology">Oncology Nursing</SelectItem>
                <SelectItem value="management">Nursing Management/Leadership</SelectItem>
                <SelectItem value="education">Nursing Education</SelectItem>
                <SelectItem value="no-specialization">No formal specialization</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="professional-plans">What are your professional plans for the next 2-3 years? *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your main professional goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stay-current">Stay current in nursing practice</SelectItem>
                <SelectItem value="pursue-masters">Pursue Master's Degree</SelectItem>
                <SelectItem value="international-exam">Prepare for international exams (NCLEX, IELTS, etc.)</SelectItem>
                <SelectItem value="migrate">Migrate for nursing practice</SelectItem>
                <SelectItem value="specialization">Pursue nursing specialization</SelectItem>
                <SelectItem value="management">Move into management/leadership</SelectItem>
                <SelectItem value="education-focus">Move into nursing education</SelectItem>
                <SelectItem value="research">Engage in nursing research</SelectItem>
                <SelectItem value="undecided">Undecided</SelectItem>
                <SelectItem value="other-plans">Other plans</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="training-received">Recent professional training or seminars attended (last 12 months)</Label>
            <Textarea
              id="training-received"
              placeholder="List any conferences, seminars, workshops, or online courses..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="training-plan">What professional training would you like to pursue?</Label>
            <Textarea
              id="training-plan"
              placeholder="Describe areas where you want to develop further..."
              rows={3}
            />
          </div>
        </div>

        <Button className="w-full bg-maroon text-gold hover:bg-maroon/90">Save Professional Development Information</Button>
      </Card>
    </div>
  )
}
