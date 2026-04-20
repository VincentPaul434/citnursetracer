import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SurveyShellProps {
  children: ReactNode
  fullBleed?: boolean
}

export default function SurveyShell({ children, fullBleed = false }: SurveyShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-maroon text-gold p-4 flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          <Image src="/cit2logo.png" alt="CIT-U Logo" width={48} height={48} className="h-12 w-12 object-contain" priority />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">CEBU INSTITUTE OF TECHNOLOGY</h1>
          <p className="text-sm font-semibold">UNIVERSITY</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" className="bg-white/95 text-maroon hover:bg-white font-semibold">
            <Link href="/about">About Us</Link>
          </Button>
          <Button asChild className="bg-gold text-maroon hover:bg-gold/90 font-semibold">
            <a href="https://cit.edu/" target="_blank" rel="noopener noreferrer">
              Main Site
            </a>
          </Button>
        </div>
      </div>

      <div className={fullBleed ? "flex-1 overflow-y-auto" : "flex-1 flex items-center justify-center p-4 overflow-y-auto"}>
        {fullBleed ? (
          children
        ) : (
          <Card className="w-full max-w-5xl bg-card p-8 shadow-xl my-8 border border-maroon/20">{children}</Card>
        )}
      </div>

    </div>
  )
}
