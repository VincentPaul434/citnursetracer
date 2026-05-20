"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const NAV_LINKS: Array<{ label: string; href: string; external?: boolean }> = [
  { label: "Survey", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Main Site", href: "https://cit.edu/", external: true },
]

export default function SurveyShellHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-maroon text-gold shadow-sm shadow-maroon/20 backdrop-blur supports-[backdrop-filter]:bg-maroon/95">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-maroon"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center md:h-12 md:w-12">
            <Image
              src="/cit2logo.png"
              alt="CIT-U Logo"
              width={48}
              height={48}
              className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105 md:h-12 md:w-12"
              priority
            />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-bold tracking-tight md:text-lg">CEBU INSTITUTE OF TECHNOLOGY</h1>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/85 md:text-xs">University</p>
          </div>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => {
            const isActive = !link.external && pathname === link.href
            const baseClass =
              "relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-gold/10 hover:text-white"
            const activeClass = isActive ? "text-white after:content-[''] after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-gold" : ""

            if (link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${baseClass} ${activeClass}`}
                >
                  {link.label}
                </a>
              )
            }

            return (
              <Link key={link.href} href={link.href} className={`${baseClass} ${activeClass}`}>
                {link.label}
              </Link>
            )
          })}
          <Button asChild className="ml-2 bg-gold text-maroon hover:bg-gold/90 font-semibold shadow-sm">
            <a href="https://cit.edu/" target="_blank" rel="noopener noreferrer">
              Visit CIT-U
            </a>
          </Button>
        </nav>

        <div className="ml-auto sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="border-gold/40 bg-maroon text-gold hover:bg-maroon/80"
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
                {NAV_LINKS.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-6 py-4 text-sm font-semibold text-gold transition hover:bg-gold/10 hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-6 py-4 text-sm font-semibold transition hover:bg-gold/10 hover:text-white ${
                        pathname === link.href ? "bg-gold/10 text-white" : "text-gold"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
