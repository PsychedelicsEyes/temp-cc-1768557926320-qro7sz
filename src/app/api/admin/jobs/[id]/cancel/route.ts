export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { cancelJob } from "@/lib/admin/store"

export async function POST(
  _: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params

  const job = await cancelJob(id)
  if (!job) return new Response("Not found", { status: 404 })

  return Response.json(job)
}
