export type JobType = "upscale"

export type JobStatus = "queued" | "running" | "done" | "error" | "canceled"

export type CreateUpscaleJobInput = {
  inputDir: string
  outputDir: string
  scale: 2 | 3 | 4
  format: "webp" | "jpg" | "png"
  quality: number
  useAI?: boolean
}

export type JobProgress = {
  total: number
  ok: number
  fail: number
}

export type AdminJob = {
  id: string
  type: JobType
  status: JobStatus
  createdAt: string
  updatedAt: string
  payload: CreateUpscaleJobInput
  progress?: JobProgress
  error?: string
}

export type ListJobsResponse = { items: AdminJob[] }
