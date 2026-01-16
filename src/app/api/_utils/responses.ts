import { NextResponse } from "next/server"

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init)
}

export function badRequest(message: string, details?: unknown, init?: ResponseInit) {
  return NextResponse.json(
    { ok: false, error: { code: "BAD_REQUEST", message, details } },
    { status: 400, ...init }
  )
}

export function unauthorized(message = "Unauthorized", init?: ResponseInit) {
  return NextResponse.json(
    { ok: false, error: { code: "UNAUTHORIZED", message } },
    { status: 401, ...init }
  )
}

export function serverError(message = "Server error", details?: unknown, init?: ResponseInit) {
  return NextResponse.json(
    { ok: false, error: { code: "SERVER_ERROR", message, details } },
    { status: 500, ...init }
  )
}
