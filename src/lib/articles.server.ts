import { promises as fs } from "fs"
import path from "path"
import type { Article } from "./articles.data"

const ARTICLES_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "articles.json"
)

/* ───────────────── utils ───────────────── */

async function readArticles(): Promise<Article[]> {
  const raw = await fs.readFile(ARTICLES_PATH, "utf-8")
  return JSON.parse(raw) as Article[]
}

/* ───────────────── public API ───────────────── */

export async function getArticles(): Promise<Article[]> {
  const articles = await readArticles()

  // tri par date desc
  return [...articles].sort((a, b) =>
    a.date < b.date ? 1 : -1
  )
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  const articles = await readArticles()
  return articles.find((a) => a.slug === slug) ?? null
}
