import { NextResponse } from "next/server"
import path from "node:path"
import { promises as fs } from "node:fs"
import { ensureDir } from "@/lib/admin/content-store"
import { requireAdmin, forbidden } from "@/lib/admin/auth-guard"

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"])

export async function POST(req: Request) {
  if (!requireAdmin()) return forbidden()

  const form = await req.formData()
  const file = form.get("file") as File | null
  const folder = String(form.get("folder") ?? "").trim()
  const type = String(form.get("type") ?? "properties").trim()

  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 })
  if (!folder) return NextResponse.json({ error: "Missing folder" }, { status: 400 })
  if (!ALLOWED.has(file.type))
    return NextResponse.json({ error: "Type non supporté" }, { status: 400 })

  const validTypes = ["properties", "articles"]
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 })
  }

  const buf = Buffer.from(await file.arrayBuffer())
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const absDir = path.join(process.cwd(), "public", type, folder)
  await ensureDir(absDir)

  const absPath = path.join(absDir, safeName)
  await fs.writeFile(absPath, buf)

  return NextResponse.json({
    ok: true,
    fileName: safeName,
    url: `/${type}/${folder}/${safeName}`,
  })
}
