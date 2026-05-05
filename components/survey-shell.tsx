import type { ReactNode } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import SurveyShellHeader from "@/components/survey-shell-header"

interface SurveyShellProps {
  children: ReactNode
  fullBleed?: boolean
}

export default function SurveyShell({ children, fullBleed = false }: SurveyShellProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SurveyShellHeader />

      <div className={fullBleed ? "flex-1 overflow-y-auto" : "flex-1 flex items-center justify-center p-4 overflow-y-auto"}>
        {fullBleed ? (
          children
        ) : (
          <Card className="w-full max-w-5xl bg-card p-8 shadow-xl my-8 border border-maroon/20">{children}</Card>
        )}
      </div>

      <footer className="border-t border-maroon/20 bg-white/95 px-4 py-3">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-3 text-center sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <Image src="/cit2logo.png" alt="CIT-U Footer Logo" width={28} height={28} className="h-7 w-7 object-contain" />
            <p className="text-xs font-semibold text-maroon sm:text-sm">Cebu Institute of Technology - University</p>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">Copyright {currentYear} CIT-U. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
