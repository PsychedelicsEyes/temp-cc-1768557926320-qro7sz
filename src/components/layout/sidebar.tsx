"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { FileText, Menu, X, LogIn, LogOut } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"

/* ───────────────── utils ───────────────── */

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

/* ───────────────── nav config ───────────────── */

type NavItem = { href: string; label: string }

const NAV: NavItem[] = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "Offices" },
  { href: "/articles", label: "Articles" },
  { href: "/contact", label: "Contact" },
]

/* ───────────────── ui blocks ───────────────── */

function StripesCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cx(
        "relative overflow-hidden border border-black/10 bg-white",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 2px, transparent 2px, transparent 8px)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 512"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M279.14 288l14.22-92.66h-88.91V117.78c0-25.35 12.42-50.06 52.24-50.06H297V6.26S259.36 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  )
}

/* ───────────────── navlinks (height responsive) ───────────────── */

function NavLinks({
  variant,
  onNavigate,
}: {
  variant: "desktop" | "mobile"
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const { status } = useSession()
  const loggedIn = status === "authenticated"

  const items: NavItem[] = loggedIn
    ? [...NAV, { href: "/admin", label: "Admin" }]
    : NAV

  /**
   * Responsive EN HAUTEUR (min-h-*).
   * Base = compact (petite hauteur), et ça grossit quand la hauteur dispo augmente.
   */
  const linkText =
    variant === "mobile"
      ? cx(
          // compact (petites hauteurs)
          "text-[20px] leading-[1.02]",
          // + grand si hauteur ok
          "min-h-[680px]:text-[24px] min-h-[680px]:leading-[1]",
          "min-h-[760px]:text-[28px] min-h-[760px]:leading-[0.98]",
          "min-h-[860px]:text-[30px]",
          // garde ton boost sur sm mais seulement si hauteur ok
          "sm:min-h-[760px]:text-[34px]"
        )
      : cx(
          "text-[26px] leading-[1.02]",
          "min-h-[760px]:text-[30px] min-h-[760px]:leading-[1]",
          "min-h-[900px]:text-[36px] min-h-[900px]:leading-[0.98]"
        )

  const listSpacing =
    variant === "mobile"
      ? cx(
          "space-y-2",
          "min-h-[680px]:space-y-3",
          "min-h-[760px]:space-y-4"
        )
      : cx(
          "space-y-3",
          "min-h-[820px]:space-y-4",
          "min-h-[900px]:space-y-4"
        )

  const underlineW =
    variant === "mobile"
      ? cx("w-9", "min-h-[760px]:w-12")
      : cx("w-12", "min-h-[900px]:w-16")

  const underlineMt =
    variant === "mobile"
      ? cx("mt-2", "min-h-[760px]:mt-3")
      : cx("mt-2", "min-h-[900px]:mt-3")

  return (
    <nav aria-label="Navigation">
      <ul className={listSpacing}>
        {items.map((item) => {
          const active = pathname === item.href

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cx(
                  "group block w-full font-light tracking-tight transition-colors",
                  linkText,
                  active ? "text-black" : "text-black/70 hover:text-black"
                )}
              >
                <span className="block">{item.label}</span>

                <span className={cx(underlineMt, "block h-[2px]")}>
                  <span
                    className={cx(
                      "block h-[2px] transition-opacity",
                      underlineW,
                      active
                        ? "opacity-100 bg-black/80"
                        : "opacity-0 bg-black/60 group-hover:opacity-100"
                    )}
                  />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/* ───────────────── auth actions ───────────────── */

function AuthActions({ variant }: { variant: "desktop" | "mobile" }) {
  const { data, status } = useSession()
  if (status === "loading") return null

  const user = data?.user
  const loggedIn = !!user

  if (!loggedIn) {
    return (
      <button
        type="button"
        onClick={() => signIn("discord")}
        className={cx(
          "inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2",
          "text-[12px] uppercase tracking-[0.22em] text-black/70 hover:bg-black/[0.03]",
          variant === "desktop" ? "w-full justify-center" : ""
        )}
      >
        <LogIn className="h-4 w-4" />
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <div
        className={cx(
          "flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-3 py-2",
          "hover:bg-black/[0.02]"
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-black/10 bg-black/[0.04]">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Avatar"}
                fill
                sizes="36px"
                className="object-cover"
                unoptimized
              />
            ) : null}
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-black/85">
              {user?.name ?? "Utilisateur"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/55 hover:bg-black/[0.04]"
          aria-label="Se déconnecter"
          title="Se déconnecter"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function SidebarFooter({
  onNavigate,
  variant = "desktop",
}: {
  onNavigate?: () => void
  variant?: "desktop" | "mobile"
}) {
  return (
    <div className="pt-8">
      <div className="mb-5 h-[1px] w-full bg-black/5" />

      <div className="mb-4">
        <AuthActions variant={variant} />
      </div>

      <div className="flex items-center justify-between">
        <a
          href="https://www.facebook.com/profile.php?id=100043608446152#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="inline-flex items-center text-black/40 transition hover:text-black"
        >
          <FacebookIcon className="h-4 w-4" />
        </a>

        <Link
          href="/mentions-legales"
          onClick={onNavigate}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-black/40 transition hover:text-black"
        >
          <FileText className="h-3.5 w-3.5" />
          Mentions légales
        </Link>
      </div>

      <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-black/30">
        © {new Date().getFullYear()} Study Case
      </p>
    </div>
  )
}

/* ───────────────── main component ───────────────── */

export default function Sidebar() {
  const pathname = usePathname()
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/")
  const [open, setOpen] = useState(false)

  /* fermer le menu si on arrive sur /admin */
  useEffect(() => {
    if (isAdmin) setOpen(false)
  }, [isAdmin])

  /* empêcher le scroll quand le drawer est ouvert */
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [open])

  /* ESC pour fermer */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  /* ⛔ AUCUNE SIDEBAR SUR /admin */
  if (isAdmin) return null

  const Brand = ({ size }: { size: "desktop" | "mobile" }) => (
    <div className="leading-none">
      <div
        className={cx(
          "font-light tracking-tight text-black",
          size === "desktop"
            ? "text-[54px] leading-[0.92]"
            : "text-[34px] leading-[0.95]"
        )}
      >
        Study Case
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.28em] text-black/50">
        Architectes
      </div>
    </div>
  )

  return (
    <>
      {/* 
        CSS var pour compenser la topbar fixe sur mobile (drawer)
      */}
      <style jsx global>{`
        :root {
          --topbar-h: 72px;
        }
        @media (min-width: 640px) {
          :root {
            --topbar-h: 80px;
          }
        }
      `}</style>

      {/* ── topbar mobile ── */}
      <div className="fixed top-0 z-40 flex w-full items-center justify-between border-b border-black/10 bg-white px-5 py-4 lg:hidden">
        <Brand size="mobile" />

        <div className="flex items-center gap-2">
          <AuthActions variant="mobile" />

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-black/15 bg-white px-4 text-[12px] uppercase tracking-[0.22em] text-black/70 hover:bg-black/[0.03]"
          >
            Menu
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── sidebar desktop ── */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-80 lg:flex-col lg:border-r lg:border-black/10 lg:bg-white lg:px-10 lg:py-10">
        {/* scroll interne si faible hauteur écran */}
        <div className="flex h-full flex-col overflow-y-auto">
          <div>
            <Brand size="desktop" />

            <StripesCard className="mt-8 px-8 py-10">
              <NavLinks variant="desktop" />
            </StripesCard>
          </div>

          <div className="mt-auto">
            <SidebarFooter variant="desktop" />
          </div>
        </div>
      </aside>

      {/* ── drawer mobile ── */}
      <div
        className={cx(
          "lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <button
          onClick={() => setOpen(false)}
          className={cx(
            "fixed inset-0 z-50 bg-black/30 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          aria-label="Fermer le menu"
        />

        <div
          className={cx(
            "fixed left-0 top-0 z-[60] w-[86%] max-w-sm bg-white shadow-xl transition-transform duration-300",
            // ✅ vraie hauteur visible mobile
            "h-[100dvh] pt-[var(--topbar-h)]",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* layout : header / scroll */}
          <div className="flex h-full flex-col">
            {/* header */}
            <div className="shrink-0 px-7 pt-6">
              <div className="flex items-start justify-between">
                <Brand size="mobile" />

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-black/15 p-2 text-black/60 hover:bg-black/[0.03]"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="my-6 h-[1px] bg-black/10" />
            </div>

            {/* ✅ zone scrollable */}
            <div className="min-h-0 flex-1 overflow-y-auto px-7 pb-6">
              <StripesCard className="px-6 py-7">
                <NavLinks variant="mobile" onNavigate={() => setOpen(false)} />
              </StripesCard>

              <div className="mt-8">
                <SidebarFooter
                  variant="mobile"
                  onNavigate={() => setOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
