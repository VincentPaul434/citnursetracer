"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EmploymentSection() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Current Employment Status</h2>
        <p className="text-sm text-muted-foreground">Share information about your current work situation</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employment-status">Are you currently employed? *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Yes, employed</SelectItem>
                <SelectItem value="unemployed">No, unemployed</SelectItem>
                <SelectItem value="self-employed">Self-employed</SelectItem>
                <SelectItem value="further-studies">Pursuing further studies</SelectItem>
                <SelectItem value="not-seeking">Not seeking employment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="months-to-employment">Months to secure first job after graduation</Label>
            <Input id="months-to-employment" type="number" placeholder="e.g., 2" min="0" />
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Current Job Information:</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title/Position</Label>
                <Input id="job-title" placeholder="e.g., Staff Nurse, Nurse Manager" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employer">Employer/Organization Name</Label>
                <Input id="employer" placeholder="Name of hospital, clinic, or organization" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facility-type">Type of Healthcare Facility</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="clinic">Clinic/Primary Health Care</SelectItem>
                    <SelectItem value="community">Community Health Center</SelectItem>
                    <SelectItem value="nursing-home">Nursing Home/LTC Facility</SelectItem>
                    <SelectItem value="school">School Health Service</SelectItem>
                    <SelectItem value="corporate">Corporate/Occupational Health</SelectItem>
                    <SelectItem value="non-healthcare">Non-healthcare organization</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Work Location</Label>
                <Input id="location" placeholder="City/Province or Country if abroad" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment-type">Type of Employment *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contractual">Contractual</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary-range">Monthly Salary Range (Optional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below-20k">Below ₱20,000</SelectItem>
                    <SelectItem value="20k-30k">₱20,000 - ₱30,000</SelectItem>
                    <SelectItem value="30k-40k">₱30,000 - ₱40,000</SelectItem>
                    <SelectItem value="40k-50k">₱40,000 - ₱50,000</SelectItem>
                    <SelectItem value="50k-60k">₱50,000 - ₱60,000</SelectItem>
                    <SelectItem value="above-60k">Above ₱60,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full bg-maroon text-gold hover:bg-maroon/90">Save Employment Information</Button>
      </Card>

      <Card className="p-6 space-y-4 bg-gradient-to-br from-maroon/5 to-gold/5">
        <h3 className="text-lg font-semibold text-foreground">Job Satisfaction Rating</h3>
        <p className="text-sm text-muted-foreground">How satisfied are you with your current job? (1 = Very Unsatisfied, 5 = Very Satisfied)</p>
        <div className="space-y-3">
          {[
            "Overall job satisfaction",
            "Work environment and safety",
            "Compensation/salary",
            "Career advancement opportunities",
            "Work-life balance",
            "Supervisor support and recognition",
          ].map((aspect) => (
            <div key={aspect} className="flex items-center justify-between">
              <Label className="text-sm">{aspect}</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className="w-8 h-8 rounded-full border border-maroon/30 hover:bg-maroon hover:text-gold transition-colors text-sm"
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
