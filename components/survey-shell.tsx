import type { ReactNode } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface SurveyShellProps {
  children: ReactNode
}

export default function SurveyShell({ children }: SurveyShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-maroon text-gold p-4 flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          <Image src="/download.png" alt="CIT-U Logo" width={48} height={48} className="h-12 w-12 object-contain" priority />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">CEBU INSTITUTE OF TECHNOLOGY</h1>
          <p className="text-sm font-semibold">UNIVERSITY</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        <Card className="w-full max-w-3xl bg-card p-8 shadow-xl my-8 border border-maroon/20">{children}</Card>
      </div>

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
        <div className="w-96 h-96 rounded-full border-8 border-maroon flex items-center justify-center">
          <svg className="w-64 h-64 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
