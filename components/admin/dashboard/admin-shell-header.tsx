"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BarChart3 } from "lucide-react"
import AdminNotificationCenter from "@/components/admin/dashboard/admin-notification-center"
import AdminUserMenu from "@/components/admin/dashboard/admin-user-menu"

const NAV: Array<{ label: string; href: string; icon: typeof LayoutDashboard }> = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
]

interface AdminShellHeaderProps {
  username?: string
}

export default function AdminShellHeader({ username = "Admin" }: AdminShellHeaderProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-maroon text-gold shadow-sm shadow-maroon/20">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-maroon"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center md:h-12 md:w-12">
            <Image src="/cit2logo.png" alt="CIT-U Logo" width={48} height={48} className="h-11 w-11 object-contain md:h-12 md:w-12" priority />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-bold tracking-tight md:text-lg">CEBU INSTITUTE OF TECHNOLOGY</h1>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/85 md:text-xs">University · Admin</p>
          </div>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-gold/10 hover:text-white ${
                  isActive ? "text-white" : "text-gold/90"
                }`}
              >
                <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                {link.label}
                {isActive ? (
                  <span className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-gold" aria-hidden />
                ) : null}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <AdminNotificationCenter />
          <AdminUserMenu username={username} />
        </div>
      </div>

      <nav className="flex items-center gap-1 border-t border-gold/15 px-3 py-2 md:hidden">
        {NAV.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive ? "bg-gold/15 text-white" : "text-gold/90 hover:bg-gold/10 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
