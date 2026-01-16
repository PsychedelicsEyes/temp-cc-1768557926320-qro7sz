import { NextResponse } from "next/server"
import {
  getPropertiesStore,
  savePropertiesStore,
  getNextPropertyFolder,
} from "@/lib/admin/content-store"
import { slugify } from "@/lib/admin/slug"
import { requireAdmin, forbidden } from "@/lib/admin/auth-guard"

export async function GET() {
  const list = await getPropertiesStore()
  return NextResponse.json(list)
}

export async function POST(req: Request) {
  if (!requireAdmin()) return forbidden()

  const body = await req.json()

  const title = String(body.title ?? "").trim()
  if (!title) return NextResponse.json({ error: "Titre requis" }, { status: 400 })

  const slug = String(body.slug ?? slugify(title)).trim()
  const list = await getPropertiesStore()

  if (list.some((p) => p.slug === slug)) {
    return NextResponse.json({ error: "Slug déjà utilisé" }, { status: 400 })
  }

  const folder = await getNextPropertyFolder()

  const created = {
    slug,
    title,
    category: body.category ?? "Public",
    location: body.location ?? "",
    paragraphs: Array.isArray(body.paragraphs) ? body.paragraphs : [],

    folder,
    heroFile: body.heroFile ?? "",
    heroAlt: body.heroAlt ?? "",

    owner: body.owner ?? "",
    program: body.program ?? "",
    cost: body.cost ?? "",
    area: body.area ?? "",
    mission: body.mission ?? "",
    year: body.year ?? "",

    seoTitle: body.seoTitle ?? "",
    seoDescription: body.seoDescription ?? "",
  }

  await savePropertiesStore([created, ...list])
  return NextResponse.json(created)
}
