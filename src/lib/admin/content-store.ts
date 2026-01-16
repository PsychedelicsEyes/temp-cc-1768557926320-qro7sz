import "server-only"
import { promises as fs } from "fs"
import path from "path"

const ROOT = process.cwd()
const DATA_DIR = path.join(ROOT, "src", "data")

const ARTICLES_PATH = path.join(DATA_DIR, "articles.json")
const PROPERTIES_PATH = path.join(DATA_DIR, "properties.json")

async function readJson<T>(p: string): Promise<T> {
  const raw = await fs.readFile(p, "utf-8")
  return JSON.parse(raw) as T
}

async function writeJson<T>(p: string, data: T): Promise<void> {
  const raw = JSON.stringify(data, null, 2)
  await fs.writeFile(p, raw, "utf-8")
}

/* Articles */
export async function getArticlesStore() {
  return readJson<any[]>(ARTICLES_PATH)
}
export async function saveArticlesStore(list: any[]) {
  return writeJson(ARTICLES_PATH, list)
}

/* Properties */
export async function getPropertiesStore() {
  return readJson<any[]>(PROPERTIES_PATH)
}
export async function savePropertiesStore(list: any[]) {
  return writeJson(PROPERTIES_PATH, list)
}

/* Folder helper: pick next numeric folder id */
export async function getNextPropertyFolder(): Promise<string> {
  const list = await getPropertiesStore()
  const max = list.reduce((m, p) => {
    const n = Number(p.folder)
    return Number.isFinite(n) ? Math.max(m, n) : m
  }, 0)
  return String(max + 1)
}

export async function ensureDir(absDir: string) {
  await fs.mkdir(absDir, { recursive: true })
}
