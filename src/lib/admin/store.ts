import fs from "node:fs/promises"
import path from "node:path"
import type { AdminJob, JobStatus, JobType, JobProgress, CreateUpscaleJobInput } from "./types"

type DBShape = {
  jobs: AdminJob[]
}

const DATA_DIR = path.join(process.cwd(), ".data")
const DB_PATH = path.join(DATA_DIR, "admin-jobs.json")

async function ensureDb() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(DB_PATH)
  } catch {
    const init: DBShape = { jobs: [] }
    await fs.writeFile(DB_PATH, JSON.stringify(init, null, 2), "utf8")
  }
}

async function readDb(): Promise<DBShape> {
  await ensureDb()
  const raw = await fs.readFile(DB_PATH, "utf8")
  try {
    return JSON.parse(raw) as DBShape
  } catch {
    return { jobs: [] }
  }
}

async function writeDb(db: DBShape) {
  await ensureDb()
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8")
}

function nowISO() {
  return new Date().toISOString()
}

function makeId() {
  // id court lisible (pas crypto, mais suffisant ici)
  return (
    "SYT" +
    Math.random().toString(36).slice(2, 8).toUpperCase() +
    Date.now().toString(36).toUpperCase()
  )
}

export async function createUpscaleJob(payload: CreateUpscaleJobInput): Promise<AdminJob> {
  const db = await readDb()
  const job: AdminJob = {
    id: makeId(),
    type: "upscale",
    status: "queued",
    createdAt: nowISO(),
    updatedAt: nowISO(),
    payload,
    progress: { total: 0, ok: 0, fail: 0 },
  }
  db.jobs.unshift(job)
  await writeDb(db)
  return job
}

export async function listJobs(opts: { type?: JobType; limit?: number } = {}): Promise<AdminJob[]> {
  const db = await readDb()
  const items = opts.type ? db.jobs.filter((j) => j.type === opts.type) : db.jobs
  return items.slice(0, opts.limit ?? 30)
}

export async function getJob(jobId: string): Promise<AdminJob | null> {
  const db = await readDb()
  return db.jobs.find((j) => j.id === jobId) ?? null
}

export async function updateJob(
  jobId: string,
  patch: Partial<Pick<AdminJob, "status" | "progress" | "error" | "payload">>
): Promise<AdminJob | null> {
  const db = await readDb()
  const idx = db.jobs.findIndex((j) => j.id === jobId)
  if (idx === -1) return null

  const prev = db.jobs[idx]
  const next: AdminJob = {
    ...prev,
    ...patch,
    updatedAt: nowISO(),
  }

  db.jobs[idx] = next
  await writeDb(db)
  return next
}

export async function setJobStatus(jobId: string, status: JobStatus, error?: string) {
  return updateJob(jobId, { status, error })
}

export async function setJobProgress(jobId: string, progress: JobProgress) {
  return updateJob(jobId, { progress })
}

/* -------------------------------------------------------------------------- */
/*                          NEW: cancel / delete / check                       */
/* -------------------------------------------------------------------------- */

export async function cancelJob(jobId: string): Promise<AdminJob | null> {
  const db = await readDb()
  const idx = db.jobs.findIndex((j) => j.id === jobId)
  if (idx === -1) return null

  const prev = db.jobs[idx]

  // si déjà terminé/annulé => ne rien faire
  if (prev.status === "done" || prev.status === "error" || prev.status === "canceled") {
    return prev
  }

  const next: AdminJob = {
    ...prev,
    status: "canceled",
    updatedAt: nowISO(),
  }

  db.jobs[idx] = next
  await writeDb(db)
  return next
}

export async function deleteJob(jobId: string): Promise<boolean> {
  const db = await readDb()
  const before = db.jobs.length
  db.jobs = db.jobs.filter((j) => j.id !== jobId)

  const changed = db.jobs.length !== before
  if (changed) await writeDb(db)
  return changed
}

export async function isJobCanceled(jobId: string): Promise<boolean> {
  const job = await getJob(jobId)
  return job?.status === "canceled"
}
