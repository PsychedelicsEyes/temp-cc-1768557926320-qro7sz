import { NextResponse } from "next/server"
import { listJobs } from "@/lib/admin/store"
import type { JobType } from "@/lib/admin/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const url = new URL(req.url)

  const type = url.searchParams.get("type") as JobType | null
  const limit = Number(url.searchParams.get("limit") ?? "30")

  const jobs = await listJobs({
    type: type ?? undefined,
    limit: Number.isFinite(limit) ? Math.max(1, Math.min(limit, 200)) : 30,
  })

  return NextResponse.json({ items: jobs }, { status: 200 })
}
