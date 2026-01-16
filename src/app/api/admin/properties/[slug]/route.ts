import { NextResponse } from "next/server"
import { getPropertiesStore, savePropertiesStore } from "@/lib/admin/content-store"
import { requireAdmin, forbidden } from "@/lib/admin/auth-guard"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const list = await getPropertiesStore()
  return NextResponse.json(list.find((p) => p.slug === slug) ?? null)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!requireAdmin()) return forbidden()

  const { slug } = await params
  const patch = await req.json()

  const list = await getPropertiesStore()
  const idx = list.findIndex((p) => p.slug === slug)
  if (idx === -1) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  // slug/folder immuables
  const prev = list[idx]
  const next = { ...prev, ...patch, slug: prev.slug, folder: prev.folder }

  list[idx] = next
  await savePropertiesStore(list)
  return NextResponse.json(next)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!requireAdmin()) return forbidden()

  const { slug } = await params
  const list = await getPropertiesStore()
  await savePropertiesStore(list.filter((p) => p.slug !== slug))
  return NextResponse.json({ ok: true })
}
