export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { getJob, deleteJob } from "@/lib/admin/store"

export async function GET(
  _: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params

  const job = await getJob(id)
  if (!job) return new Response("Not found", { status: 404 })

  return Response.json(job)
}

export async function DELETE(
  _: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params

  const ok = await deleteJob(id)
  if (!ok) return new Response("Not found", { status: 404 })

  return new Response(null, { status: 204 })
}
