"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LicensureSection() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Professional Licensure & Examinations</h2>
        <p className="text-sm text-muted-foreground">Track your PNLE results and other professional certifications</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pnle-status">Philippine Nurses Licensure Examination (PNLE) Status *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select PNLE status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="waiting-results">Waiting for results</SelectItem>
                <SelectItem value="not-taken">Not yet taken</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exam-date">Date of PNLE Examination</Label>
            <Input id="exam-date" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attempts">Number of PNLE Attempts</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select attempt number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Attempt</SelectItem>
                <SelectItem value="2">2nd Attempt</SelectItem>
                <SelectItem value="3">3rd Attempt</SelectItem>
                <SelectItem value="4+">4th Attempt or more</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pnle-rating">PNLE Rating (if passed) - Optional</Label>
            <Input id="pnle-rating" type="number" placeholder="e.g., 81.50" step="0.01" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prc-license">PRC License Number (if available) - Optional</Label>
            <Input id="prc-license" placeholder="License number from PRC" />
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Other Professional Certifications:</h3>
            
            <div className="space-y-3">
              {[
                { id: "bls", label: "BLS (Basic Life Support)" },
                { id: "acls", label: "ACLS (Advanced Cardiac Life Support)" },
                { id: "pals", label: "PALS (Pediatric Advanced Life Support)" },
                { id: "tncc", label: "TNCC (Trauma Nursing Core Course)" },
                { id: "cna", label: "CNA (Certified Nursing Assistant)" },
              ].map((cert) => (
                <div key={cert.id} className="flex items-center gap-2">
                  <input type="checkbox" id={cert.id} className="rounded" />
                  <Label htmlFor={cert.id} className="font-normal">
                    {cert.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="other-certifications">Other Certifications/Qualifications (Optional)</Label>
            <Input id="other-certifications" placeholder="List any additional certifications" />
          </div>
        </div>

        <Button className="w-full bg-maroon text-gold hover:bg-maroon/90">Save Licensure Information</Button>
      </Card>
    </div>
  )
}
