"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
  LayoutDashboard,
  Image as ImageIcon,
  Briefcase,
  Menu,
  X,
  ChevronRight,
  Home,
  ArrowLeft,
  House,
} from "lucide-react"
import UserMenu from "@/components/admin/ui/userMenu"

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
}

const SIDEBAR_W = 300

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Propriétés", icon: House },
  { href: "/admin/articles", label: "Articles", icon: Menu },
  { href: "/admin/upscale", label: "Upscale", icon: ImageIcon },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
]

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className="leading-none">
      <div
        className={cx(
          "font-light tracking-tight text-black",
          compact ? "text-[20px]" : "text-[26px]"
        )}
      >
        Study Case
      </div>
    </div>
  )
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cx(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition",
              active ? "bg-black/[0.04]" : "hover:bg-black/[0.03]"
            )}
          >
            <span
              className={cx(
                "inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-white transition",
                active
                  ? "border-black/15"
                  : "border-black/10 group-hover:border-black/15"
              )}
            >
              <Icon
                className={cx(
                  "h-4 w-4",
                  active ? "text-black" : "text-black/70"
                )}
              />
            </span>

            <div className="min-w-0 leading-none">
              <div
                className={cx(
                  "truncate text-sm tracking-tight",
                  active ? "text-black" : "text-black/75"
                )}
              >
                {item.label}
              </div>
              <div className="mt-1 truncate text-[10px] uppercase tracking-[0.22em] text-black/35">
                {item.href}
              </div>
            </div>
          </Link>
        )
      })}
    </nav>
  )
}

function useCurrentPageLabel() {
  const pathname = usePathname()
  return useMemo(() => {
    if (pathname === "/admin") return "Dashboard"

    const match = NAV.find((n) => pathname.startsWith(n.href) && n.href !== "/admin")

    if (match) {
      if (pathname === match.href) {
        return match.label
      }

      if (pathname.endsWith("/new")) {
        return `Nouveau ${match.label.toLowerCase().slice(0, -1)}`
      }

      return match.label
    }

    return "Admin"
  }, [pathname])
}

function Breadcrumbs({ label }: { label: string }) {
  const pathname = usePathname()

  const crumbs = useMemo(() => {
    return [
      { href: "/admin", label: "Admin" },
      ...(pathname !== "/admin" ? [{ href: pathname, label }] : []),
    ]
  }, [pathname, label])

  return (
    <div className="flex items-center gap-2 text-[12px] min-w-0">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-black/70 hover:bg-black/[0.03]"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Admin</span>
      </Link>

      {crumbs.slice(1).map((c) => (
        <div key={c.href} className="flex items-center gap-2 min-w-0">
          <ChevronRight className="h-4 w-4 shrink-0 text-black/30" />
          <span className="truncate rounded-full px-2.5 py-1 text-black/80">
            {c.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const pageLabel = useCurrentPageLabel()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  useEffect(() => {
    setOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Sidebar desktop */}
      <aside
        className="fixed inset-y-0 left-0 z-50 hidden border-r border-black/10 bg-white lg:flex"
        style={{ width: SIDEBAR_W }}
      >
        <div className="flex h-full w-full flex-col p-5">
          <Brand />
          <div className="mt-5 h-[1px] w-full bg-black/10" />

          <div className="mt-4">
            <SidebarNav />
          </div>

          {/* Footer : UserMenu */}
          <div className="mt-auto pt-6">
            <div className="h-[1px] w-full bg-black/10" />
            <div className="mt-4 flex items-center justify-center">
              <UserMenu />
            </div>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur lg:ml-[300px] lg:w-[calc(100%-300px)]">
        <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
          {/* Left */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white text-black/70 hover:bg-black/[0.03] lg:hidden"
              aria-label="Ouvrir le menu admin"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Mobile title */}
            <div className="min-w-0 sm:hidden">
              <div className="truncate text-sm font-medium tracking-tight text-black">
                {pageLabel}
              </div>
              <div className="truncate text-[11px] uppercase tracking-[0.22em] text-black/35">
                Admin
              </div>
            </div>

            {/* Breadcrumbs >= sm */}
            <div className="hidden min-w-0 sm:block">
              <Breadcrumbs label={pageLabel} />
            </div>
          </div>

          {/* Right */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-3 py-2 text-[12px] uppercase tracking-[0.22em] text-black/70 hover:bg-black/[0.03] sm:px-4"
              aria-label="Retour au site"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Retour site</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 py-6 lg:ml-[300px] lg:w-[calc(100%-300px)] lg:px-6 lg:py-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>

      {/* Drawer mobile */}
      <div
        className={cx(
          "lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <button
          type="button"
          aria-label="Fermer"
          onClick={() => setOpen(false)}
          className={cx(
            "fixed inset-0 z-50 bg-black/30 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          className={cx(
            "fixed inset-y-0 left-0 z-[60] w-[86%] max-w-sm bg-white shadow-xl transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex h-full flex-col p-5">
            <div className="flex items-start justify-between">
              <Brand compact />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-black/15 p-2 text-black/60 hover:bg-black/[0.03]"
                aria-label="Fermer le menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="my-5 h-[1px] w-full bg-black/10" />

            <SidebarNav onNavigate={() => setOpen(false)} />

            <div className="mt-auto pt-6">
              <div className="h-[1px] w-full bg-black/10" />
              <div className="mt-4 flex items-center justify-between">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
