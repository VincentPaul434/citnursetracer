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
    <div className="relative flex min-h-screen flex-col bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--gold)_22%,transparent),transparent_70%)]"
      />

      <SurveyShellHeader />

      <main
        className={
          fullBleed
            ? "flex-1 overflow-y-auto"
            : "flex-1 overflow-y-auto px-4 py-8 sm:py-10 md:px-6"
        }
      >
        {fullBleed ? (
          children
        ) : (
          <Card className="mx-auto w-full max-w-5xl border border-maroon/15 bg-card p-6 shadow-xl shadow-maroon/5 sm:p-8 md:p-10 animate-fade-up">
            {children}
          </Card>
        )}
      </main>

      <footer className="border-t border-maroon/15 bg-white/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2.5">
            <Image
              src="/cit2logo.png"
              alt="CIT-U Footer Logo"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <div>
              <p className="text-xs font-semibold text-maroon sm:text-sm">Cebu Institute of Technology - University</p>
              <p className="text-[11px] text-muted-foreground">Nursing Graduate Tracer Study</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">© {currentYear} CIT-U. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
