"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GraduationCap, Briefcase, FileText, TrendingUp, Award, Globe, LogOut, User, CheckCircle2 } from "lucide-react"
import ProfileSection from "@/components/profile-section"
import LicensureSection from "@/components/licensure-section"
import EmploymentSection from "@/components/employment-section"
import CompetencySection from "@/components/competency-section"
import CPDSection from "@/components/cpd-section"
import MigrationSection from "@/components/migration-section"

interface DashboardPageProps {
  onLogout: () => void
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [activeSection, setActiveSection] = useState("overview")

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />
      case "licensure":
        return <LicensureSection />
      case "employment":
        return <EmploymentSection />
      case "competency":
        return <CompetencySection />
      case "cpd":
        return <CPDSection />
      case "migration":
        return <MigrationSection />
      default:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome to Nursing Graduate Tracer Study</h2>
              <p className="text-muted-foreground">
                Track your professional journey and contribute to curriculum improvement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className="p-6 bg-card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveSection("profile")}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-maroon/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-maroon" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Graduate Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your basic information, batch year, and contact details
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className="p-6 bg-card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveSection("licensure")}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-maroon/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-maroon" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Licensure Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Record your PNLE results, attempts, and review center
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className="p-6 bg-card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveSection("employment")}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-maroon/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-maroon" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Employment Status</h3>
                    <p className="text-sm text-muted-foreground">Share your current job details and work environment</p>
                  </div>
                </div>
              </Card>

              <Card
                className="p-6 bg-card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveSection("competency")}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-maroon/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-maroon" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Competency Feedback</h3>
                    <p className="text-sm text-muted-foreground">
                      Rate how relevant your curriculum was to your current role
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className="p-6 bg-card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveSection("cpd")}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-maroon/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-maroon" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">CPD Tracker</h3>
                    <p className="text-sm text-muted-foreground">
                      Log your seminars, certifications, and specializations
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className="p-6 bg-card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveSection("migration")}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-maroon/10 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-maroon" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Migration Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Track your international career path and applications
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-gradient-to-br from-maroon/5 to-gold/5 border-maroon/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-maroon" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Your Contribution Matters</h3>
                  <p className="text-sm text-muted-foreground">
                    Your feedback helps improve the nursing curriculum for future graduates
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-maroon text-gold p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-gold" />
        </div>
        <div className="flex-1">
          <h1 className="text-base font-bold leading-tight">Nursing Graduate Tracer</h1>
          <p className="text-xs font-semibold opacity-90">CIT University</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onLogout} className="text-gold hover:bg-gold/10">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation */}
      {activeSection !== "overview" && (
        <div className="bg-card border-b border-border p-3">
          <Button
            variant="ghost"
            onClick={() => setActiveSection("overview")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Overview
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 pb-20">{renderContent()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around p-2">
          <button
            onClick={() => setActiveSection("overview")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeSection === "overview" ? "text-maroon bg-maroon/10" : "text-muted-foreground"
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span className="text-xs">Overview</span>
          </button>
          <button
            onClick={() => setActiveSection("profile")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeSection === "profile" ? "text-maroon bg-maroon/10" : "text-muted-foreground"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
          <button
            onClick={() => setActiveSection("employment")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeSection === "employment" ? "text-maroon bg-maroon/10" : "text-muted-foreground"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-xs">Work</span>
          </button>
          <button
            onClick={() => setActiveSection("cpd")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeSection === "cpd" ? "text-maroon bg-maroon/10" : "text-muted-foreground"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">CPD</span>
          </button>
        </div>
      </div>
    </div>
  )
}
