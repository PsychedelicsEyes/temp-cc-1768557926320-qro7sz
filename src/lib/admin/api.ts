// src/lib/admin/api.ts
import type {
  AdminJob,
  CreateUpscaleJobInput,
  JobStatus,
  JobType,
} from "./types"

type ApiErrorPayload =
  | { error?: string; message?: string; details?: unknown }
  | string
  | null

class ApiError extends Error {
  status: number
  payload?: unknown
  constructor(message: string, status: number, payload?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.payload = payload
  }
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  if (res.status === 204) return undefined
  const text = await res.text().catch(() => "")
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function pickErrorMessage(payload: ApiErrorPayload, status: number) {
  if (typeof payload === "string" && payload.trim()) return payload
  if (payload && typeof payload === "object") {
    const anyP = payload as any
    if (typeof anyP.error === "string" && anyP.error.trim()) return anyP.error
    if (typeof anyP.message === "string" && anyP.message.trim()) return anyP.message
  }
  return `HTTP ${status}`
}

async function request<T>(
  url: string,
  init?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  const { timeoutMs, ...rest } = init ?? {}

  const controller = new AbortController()
  const t =
    typeof timeoutMs === "number" && timeoutMs > 0
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null

  try {
    const res = await fetch(url, {
      cache: "no-store",
      ...rest,
      signal: controller.signal,
      headers: {
        ...(rest.headers ?? {}),
        ...(rest.body ? { "content-type": "application/json" } : {}),
      },
    })

    const payload = await parseJsonSafe(res)

    if (!res.ok) {
      throw new ApiError(pickErrorMessage(payload as any, res.status), res.status, payload)
    }

    return payload as T
  } finally {
    if (t) clearTimeout(t)
  }
}

function normalizeJobsResponse(data: unknown): AdminJob[] {
  if (Array.isArray(data)) return data as AdminJob[]
  if (data && typeof data === "object") {
    const anyD = data as any
    if (Array.isArray(anyD.jobs)) return anyD.jobs as AdminJob[]
    if (Array.isArray(anyD.data)) return anyD.data as AdminJob[]
  }
  return []
}

function buildQuery(params?: {
  q?: string
  status?: JobStatus | "all"
  type?: JobType | "all"
  limit?: number
}) {
  const search = new URLSearchParams()

  if (params?.q?.trim()) search.set("q", params.q.trim())
  if (typeof params?.limit === "number") search.set("limit", String(params.limit))

  // ✅ n'envoie pas "all"
  if (params?.status && params.status !== "all") search.set("status", params.status)
  if (params?.type && params.type !== "all") search.set("type", params.type)

  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export async function fetchJobs(params?: {
  q?: string
  status?: JobStatus | "all"
  type?: JobType | "all"
  limit?: number
}): Promise<AdminJob[]> {
  const data = await request<unknown>(`/api/admin/jobs${buildQuery(params)}`)
  return normalizeJobsResponse(data)
}

export async function createUpscaleJob(
  input: CreateUpscaleJobInput
): Promise<AdminJob> {
  const data = await request<unknown>("/api/admin/upscale", {
    method: "POST",
    body: JSON.stringify(input),
    timeoutMs: 60_000,
  })

  if (data && typeof data === "object" && (data as any).job) return (data as any).job as AdminJob
  return data as AdminJob
}

/** Annuler un job (queued/running -> canceled) */
export async function cancelJob(id: string): Promise<AdminJob> {
  return request<AdminJob>(`/api/admin/jobs/${encodeURIComponent(id)}/cancel`, {
    method: "POST",
    timeoutMs: 30_000,
  })
}

/** Supprimer un job */
export async function deleteJob(id: string): Promise<void> {
  await request<void>(`/api/admin/jobs/${encodeURIComponent(id)}`, {
    method: "DELETE",
    timeoutMs: 30_000,
  })
}
