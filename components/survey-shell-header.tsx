"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function SurveyShellHeader() {
  return (
    <div className="bg-maroon text-gold p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          <Image
            src="/cit2logo.png"
            alt="CIT-U Logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            priority
          />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">CEBU INSTITUTE OF TECHNOLOGY</h1>
          <p className="text-sm font-semibold">UNIVERSITY</p>
        </div>
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <Button asChild variant="secondary" className="bg-white/95 text-maroon hover:bg-white font-semibold">
            <Link href="/about">About Us</Link>
          </Button>
          <Button asChild className="bg-gold text-maroon hover:bg-gold/90 font-semibold">
            <a href="https://cit.edu/" target="_blank" rel="noopener noreferrer">
              Main Site
            </a>
          </Button>
        </div>
        <div className="ml-auto sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="border-gold/40 bg-maroon text-gold hover:bg-maroon/90"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-gold/20 bg-maroon text-gold p-0">
              <SheetHeader className="border-b border-gold/20 px-6 py-5">
                <SheetTitle className="text-gold">Menu</SheetTitle>
              </SheetHeader>
              <nav className="divide-y divide-gold/10">
                <Link
                  href="/about"
                  className="block px-6 py-4 text-sm font-semibold text-gold transition hover:bg-gold/10 hover:text-white"
                >
                  About Us
                </Link>
                <a
                  href="https://cit.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-4 text-sm font-semibold text-gold transition hover:bg-gold/10 hover:text-white"
                >
                  Main Site
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
