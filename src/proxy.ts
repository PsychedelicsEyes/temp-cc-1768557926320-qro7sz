// src/proxy.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

function allowedSetFromEnv() {
  const raw = process.env.DISCORD_ALLOWED_IDS ?? ""
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  )
}

// Cette fonction peut être async
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const protectedRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin")

  if (!protectedRoute) return NextResponse.next()

  // ⚠️ je le calcule ici (pas en top-level) pour éviter les surprises en dev / reload
  const ALLOWED = allowedSetFromEnv()

  // Si pas de whitelist => personne n’entre (comportement safe)
  if (ALLOWED.size === 0) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const url = req.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("forbidden", "1")
    return NextResponse.redirect(url)
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const discordId = (token as any)?.discordId as string | undefined
  const ok = !!discordId && ALLOWED.has(discordId)

  if (!ok) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const url = req.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("forbidden", "1")
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
