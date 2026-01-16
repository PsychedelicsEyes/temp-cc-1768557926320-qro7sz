import { NextResponse } from "next/server"
import { getArticlesStore, saveArticlesStore } from "@/lib/admin/content-store"
import { requireAdmin, forbidden } from "@/lib/admin/auth-guard"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!requireAdmin()) return forbidden()

  const { slug } = await params
  const patch = await req.json()

  const list = await getArticlesStore()
  const idx = list.findIndex((a) => a.slug === slug)
  if (idx === -1) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  const updated = { ...list[idx], ...patch, slug }
  list[idx] = updated

  await saveArticlesStore(list)
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!requireAdmin()) return forbidden()

  const { slug } = await params
  const list = await getArticlesStore()
  const next = list.filter((a) => a.slug !== slug)

  await saveArticlesStore(next)
  return NextResponse.json({ ok: true })
}