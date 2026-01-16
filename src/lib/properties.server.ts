import "server-only"
import fs from "node:fs/promises"
import path from "node:path"
import type { Property, PropertySeed, MediaAsset } from "./properties.data"

const PROPERTIES_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "properties.json"
)

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"])

function isImage(file: string) {
  return IMAGE_EXT.has(path.extname(file).toLowerCase())
}

function asset(folder: string, file: string, alt?: string): MediaAsset {
  return { src: `/properties/${folder}/${file}`, alt: alt ?? file }
}

async function readSeeds(): Promise<PropertySeed[]> {
  const raw = await fs.readFile(PROPERTIES_PATH, "utf-8")
  return JSON.parse(raw) as PropertySeed[]
}

async function listImagesSafe(folder: string): Promise<string[]> {
  try {
    const abs = path.join(process.cwd(), "public", "properties", folder)
    const entries = await fs.readdir(abs, { withFileTypes: true })
    return entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter(isImage)
      .sort((a, b) => a.localeCompare(b, "fr"))
  } catch {
    return []
  }
}

function buildProperty(seed: PropertySeed, files: string[]): Property {
  const heroName = files.includes(seed.heroFile) ? seed.heroFile : files[0]

  const hero = heroName
    ? asset(seed.folder, heroName, seed.heroAlt ?? seed.title)
    : { src: "/placeholder.jpg", alt: seed.title }

  const gallery = files
    .filter((f) => f !== heroName)
    .map((f) => asset(seed.folder, f))

  const { folder, heroFile: _heroFile, heroAlt: _heroAlt, ...rest } = seed

  return {
    ...(rest as Omit<Property, "hero" | "gallery">),
    hero,
    gallery,
  }
}

/* ───────────────── public API ───────────────── */

export async function getProperties(): Promise<Property[]> {
  const seeds = await readSeeds()

  const built = await Promise.all(
    seeds.map(async (seed) => {
      const files = await listImagesSafe(seed.folder)
      return buildProperty(seed, files)
    })
  )

  // tri (optionnel) : par title
  return built.sort((a, b) => a.title.localeCompare(b.title, "fr"))
}

export async function getPropertyBySlug(
  slug: string
): Promise<Property | null> {
  const seeds = await readSeeds()
  const seed = seeds.find((p) => p.slug === slug)
  if (!seed) return null
  const files = await listImagesSafe(seed.folder)
  return buildProperty(seed, files)
}
