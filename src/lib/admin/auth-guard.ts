import "server-only"
import { NextResponse } from "next/server"

// TODO: remplace par ton check session/role
export function requireAdmin() {
  // ex: if (!session || role !== "ADMIN") throw NextResponse.json(...)

  return true
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
