import propertiesData from "@/data/properties.json"

export type MediaAsset = { src: string; alt: string }

export type Property = {
  slug: string
  title: string
  location: string

  description: string

  hero: MediaAsset
  gallery: MediaAsset[]

  owner?: string
  program?: string
  cost?: string
  area?: string
  mission?: string
  year?: string

  seoTitle?: string
  seoDescription?: string
}

export type PropertySeed = Omit<Property, "hero" | "gallery"> & {
  folder: string
  heroFile: string
  heroAlt?: string
}

export const PROPERTIES = propertiesData as PropertySeed[]
