import { NextResponse } from "next/server"
import { getArticlesStore, saveArticlesStore } from "@/lib/admin/content-store"
import { requireAdmin, forbidden } from "@/lib/admin/auth-guard"
import { slugify } from "@/lib/admin/slug"

export async function GET() {
  const list = await getArticlesStore()
  return NextResponse.json(list)
}

export async function POST(req: Request) {
  if (!requireAdmin()) return forbidden()

  const body = await req.json()
  const title = String(body.title ?? "").trim()
  if (!title) return NextResponse.json({ error: "Titre requis" }, { status: 400 })

  const slug = String(body.slug ?? slugify(title)).trim()
  const list = await getArticlesStore()

  if (list.some((a) => a.slug === slug)) {
    return NextResponse.json({ error: "Slug déjà utilisé" }, { status: 400 })
  }

  const created = {
    slug,
    title,
    subtitle: body.subtitle ?? "",
    excerpt: body.excerpt ?? "",
    date: body.date ?? new Date().toISOString().split("T")[0],
    readTime: body.readTime ?? "2 min",
    author: body.author ?? "Study Case",
    category: body.category ?? "Chantier",
    tags: Array.isArray(body.tags) ? body.tags : [],
    cover: {
      src: body.cover?.src ?? "",
      alt: body.cover?.alt ?? "",
      caption: body.cover?.caption ?? "",
    },
    blocks: Array.isArray(body.blocks) ? body.blocks : [],
  }

  const next = [created, ...list]
  await saveArticlesStore(next)
  return NextResponse.json(created)
}
