"use client"

import { useEffect, useMemo, useState } from "react"
import { createUpscaleJob, fetchJobs } from "@/lib/admin/api"
import type { AdminJob, CreateUpscaleJobInput } from "@/lib/admin/types"
import JobsTable from "@/components/admin/ui/jobsTable"
import { AlertTriangle, Folder, Loader2, Shuffle, Wand2 } from "lucide-react"

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

type DefaultsResponse = Partial<CreateUpscaleJobInput> & {
  inputDir?: string
  outputDir?: string
}

const LS_KEY = "admin.upscale.form.v4"

// 🔒 FORCÉS
const SCALE = 4 as const
const QUALITY = 92 as const

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function normalizeWinPath(p: string) {
  return p.replace(/\//g, "\\").replace(/\\\\+/g, "\\")
}

/* ------------------------------ UI ------------------------------ */

function Card({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cx("rounded-2xl border border-black/10 bg-white", className)}>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.22em] text-black/55">
      {children}
    </div>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  icon,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="relative">
      {icon ? (
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/40">
          {icon}
        </div>
      ) : null}

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cx(
          "w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/30",
          icon ? "pl-11" : ""
        )}
      />
    </div>
  )
}

function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  leftIcon,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "primary" | "ghost"
  leftIcon?: React.ReactNode
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2 text-[12px] uppercase tracking-[0.22em] transition select-none"
  const styles =
    variant === "primary"
      ? "border-black/15 bg-white text-black/75 hover:bg-black/[0.03]"
      : "border-transparent bg-transparent text-black/65 hover:bg-black/[0.03]"
  const disabledStyles =
    "cursor-not-allowed border-black/10 bg-black/[0.03] text-black/35 hover:bg-black/[0.03]"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(base, disabled ? disabledStyles : styles)}
    >
      {leftIcon ? <span className="text-black/55">{leftIcon}</span> : null}
      {children}
    </button>
  )
}

function Chip({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-2xl border px-4 py-3 text-left transition",
        active
          ? "border-black/30 bg-black/[0.03]"
          : "border-black/15 bg-white hover:bg-black/[0.02]"
      )}
    >
      <div className="text-sm text-black/85">{title}</div>
      <div className="mt-1 text-[12px] text-black/45">{subtitle}</div>
    </button>
  )
}

/* -------------------------------- Page -------------------------------- */

export default function AdminUpscalePage() {
  const [form, setForm] = useState<{
    inputDir: string
    outputDir: string
    format: "webp" | "jpg" | "png"
  }>({
    inputDir: "",
    outputDir: "",
    format: "webp",
  })

  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)

  async function load() {
    setLoadingJobs(true)
    try {
      const list = await fetchJobs({ type: "upscale", limit: 30 })
      setJobs(list)
    } catch {
      setJobs([])
    } finally {
      setLoadingJobs(false)
    }
  }

  // defaults + localStorage
  useEffect(() => {
    let alive = true

    ;(async () => {
      const cached = safeParse<Partial<CreateUpscaleJobInput>>(localStorage.getItem(LS_KEY))

      let serverDefaults: DefaultsResponse | null = null
      try {
        const res = await fetch("/api/admin/upscale/defaults", { cache: "no-store" })
        if (res.ok) serverDefaults = (await res.json()) as DefaultsResponse
      } catch {}

      const inputDir =
        (serverDefaults?.inputDir && serverDefaults.inputDir.trim()) ||
        (cached?.inputDir && String(cached.inputDir).trim()) ||
        ""

      const outputDir =
        (serverDefaults?.outputDir && serverDefaults.outputDir.trim()) ||
        (cached?.outputDir && String(cached.outputDir).trim()) ||
        ""

      const format = (serverDefaults?.format ?? cached?.format ?? "webp") as
        | "webp"
        | "jpg"
        | "png"

      if (!alive) return
      setForm({ inputDir, outputDir, format })
    })()

    return () => {
      alive = false
    }
  }, [])

  // persist
  useEffect(() => {
    const t = window.setTimeout(() => {
      localStorage.setItem(LS_KEY, JSON.stringify(form))
    }, 200)
    return () => window.clearTimeout(t)
  }, [form])

  // polling jobs
  useEffect(() => {
    load()
    const t = window.setInterval(load, 2500)
    return () => window.clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canSubmit = useMemo(() => {
    return Boolean(form.inputDir.trim() && form.outputDir.trim())
  }, [form])

  async function onSubmit() {
    setErr(null)
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await createUpscaleJob({
        inputDir: normalizeWinPath(form.inputDir.trim()),
        outputDir: normalizeWinPath(form.outputDir.trim()),
        format: form.format,
        scale: SCALE,
        quality: QUALITY,
      })
      await load()
    } catch (e: any) {
      setErr(e?.message ?? "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  function onQuickAutoOutput() {
    const inp = form.inputDir.trim()
    if (!inp) return
    const normalized = normalizeWinPath(inp).replace(/[\\\/]+$/, "")
    setForm((s) => ({ ...s, outputDir: normalized + "_hd" }))
  }

  function onSwap() {
    setForm((s) => ({ ...s, inputDir: s.outputDir, outputDir: s.inputDir }))
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="px-6 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                Upscale
              </div>
              <div className="mt-2 text-[22px] font-light tracking-tight text-black/85">
                Real-ESRGAN — x4
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" onClick={onQuickAutoOutput} leftIcon={<Wand2 className="h-4 w-4" />}>
                Auto output
              </Button>
              <Button variant="ghost" onClick={onSwap} leftIcon={<Shuffle className="h-4 w-4" />}>
                Swap
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-5 h-[1px] w-full bg-black/10" />

        <div className="px-6 pb-6 pt-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Input</Label>
              <div className="mt-2">
                <Input
                  value={form.inputDir}
                  onChange={(v) => setForm((s) => ({ ...s, inputDir: v }))}
                  placeholder="C:\...\public\properties"
                  icon={<Folder className="h-4 w-4" />}
                />
              </div>
            </div>

            <div>
              <Label>Output</Label>
              <div className="mt-2">
                <Input
                  value={form.outputDir}
                  onChange={(v) => setForm((s) => ({ ...s, outputDir: v }))}
                  placeholder="C:\...\public\properties_hd"
                  icon={<Folder className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Label>Format</Label>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Chip
                active={form.format === "webp"}
                title="webp"
                subtitle="léger"
                onClick={() => setForm((s) => ({ ...s, format: "webp" }))}
              />
              <Chip
                active={form.format === "jpg"}
                title="jpg"
                subtitle="compatible"
                onClick={() => setForm((s) => ({ ...s, format: "jpg" }))}
              />
              <Chip
                active={form.format === "png"}
                title="png"
                subtitle="sans perte"
                onClick={() => setForm((s) => ({ ...s, format: "png" }))}
              />
            </div>
          </div>

          {err ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="text-sm text-red-800">{err}</div>
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              disabled={!canSubmit || submitting}
              onClick={onSubmit}
              leftIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            >
              {submitting ? "Création..." : "Lancer"}
            </Button>

            <Button
              variant="ghost"
              onClick={load}
              leftIcon={<Loader2 className={cx("h-4 w-4", loadingJobs ? "animate-spin" : "")} />}
            >
              Rafraîchir
            </Button>

            {!canSubmit ? (
              <div className="text-sm text-black/45">Renseigne input + output.</div>
            ) : null}
          </div>
        </div>
      </Card>

      <div className="flex items-end justify-between">
        <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">
          Historique
        </div>
        <div className="text-sm text-black/50">
          {loadingJobs ? "Chargement…" : `${jobs.length} jobs`}
        </div>
      </div>

      <JobsTable jobs={jobs} />
    </div>
  )
}
