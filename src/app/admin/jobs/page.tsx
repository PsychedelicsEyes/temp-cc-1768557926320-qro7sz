"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchJobs } from "@/lib/admin/api"
import type { AdminJob, JobStatus, JobType } from "@/lib/admin/types"
import JobsTable from "@/components/admin/ui/jobsTable"

/* ───────────────── utils ───────────────── */

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

/* ───────────────── Select (responsive + mobile safe) ───────────────── */

type SelectOption<T extends string> = {
  value: T
  label: string
  hint?: string
}

function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: T
  onChange: (v: T) => void
  options: SelectOption<T>[]
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  // close on ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  // lock scroll on mobile when open
  useEffect(() => {
    if (!open) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [open])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={cx(
          "flex w-full items-center justify-between rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm",
          "text-black/80 outline-none hover:border-black/30 focus:border-black/30"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="min-w-0 text-left">
          <div className="truncate">{selected?.label ?? placeholder ?? "—"}</div>
          {selected?.hint ? (
            <div className="mt-1 truncate text-[12px] text-black/45">
              {selected.hint}
            </div>
          ) : null}
        </div>

        <span className="ml-3 shrink-0 text-black/40">▾</span>
      </button>

      {open ? (
        <>
          {/* backdrop click */}
          <button
            type="button"
            aria-label="Fermer"
            className="fixed inset-0 z-40 cursor-default bg-black/20 sm:bg-transparent"
            onClick={() => setOpen(false)}
          />

          {/* On mobile: dropdown becomes a bottom sheet */}
          <div
            className={cx(
              "z-50 overflow-hidden border border-black/10 bg-white shadow-[0_20px_55px_rgba(0,0,0,0.14)]",
              "fixed left-3 right-3 bottom-3 rounded-2xl sm:absolute sm:left-0 sm:right-auto sm:bottom-auto sm:mt-2 sm:w-full"
            )}
            role="listbox"
          >
            {/* mobile grab / title */}
            <div className="flex items-center justify-between px-4 py-3 sm:hidden">
              <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                Choisir
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/15 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-black/60 hover:bg-black/[0.03]"
              >
                Fermer
              </button>
            </div>

            <div className="max-h-[55vh] overflow-auto">
              {options.map((opt) => {
                const active = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                    }}
                    className={cx(
                      "flex w-full flex-col px-4 py-3 text-left transition",
                      active ? "bg-black/[0.04]" : "hover:bg-black/[0.03]"
                    )}
                    role="option"
                    aria-selected={active}
                  >
                    <span className="text-sm text-black/85">{opt.label}</span>
                    {opt.hint ? (
                      <span className="text-[12px] text-black/45">{opt.hint}</span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

/* ───────────────── Page ───────────────── */

export default function AdminJobsPage() {
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<JobStatus | "all">("all")
  const [type, setType] = useState<JobType | "all">("all")

  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  async function load() {
    setErr(null)
    setLoading(true)
    try {
      const list = await fetchJobs({
        q: q.trim() || undefined,
        status,
        type,
        limit: 80,
      })
      setJobs(list)
    } catch (e: any) {
      setErr(e?.message ?? "Erreur")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // debounce recherche + filtres
  useEffect(() => {
    const t = window.setTimeout(load, 300)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, type])

  const countLabel = useMemo(() => {
    if (loading) return "Chargement…"
    return `${jobs.length} traitements`
  }, [jobs.length, loading])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">
              Admin
            </div>
            <h1 className="mt-2 text-[26px] sm:text-[30px] font-light tracking-tight">
              Traitements
            </h1>
            <p className="mt-3 text-sm text-black/60">
              Historique des traitements (upscale, export, etc.).
            </p>
          </div>

          <div className="shrink-0 text-sm text-black/50">{countLabel}</div>
        </div>

        {/* Filters: stack on mobile, 2 cols on small, 3 cols on lg */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher (id, meta…)…"
            className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none placeholder:text-black/35 focus:border-black/30"
          />

          <Select
            value={type}
            onChange={(v) => setType(v as any)}
            options={[
              { value: "all", label: "Tous les types", hint: "sans filtre" },
              { value: "upscale", label: "Upscale", hint: "traitement image" },
              { value: "export", label: "Export", hint: "génération fichiers" },
              { value: "other", label: "Autre", hint: "divers" },
            ]}
          />

          <Select
            value={status}
            onChange={(v) => setStatus(v as any)}
            options={[
              { value: "all", label: "Tous les statuts", hint: "sans filtre" },
              { value: "queued", label: "En attente", hint: "queued" },
              { value: "running", label: "En cours", hint: "running" },
              { value: "done", label: "Terminé", hint: "done" },
              { value: "canceled", label: "Annulé", hint: "canceled" },
              { value: "error", label: "Erreur", hint: "error" },
            ]}
          />
        </div>

        {err ? (
          <div className="mt-4 rounded-2xl border border-black/15 bg-black/[0.03] p-4 text-sm text-black/70">
            {err}
          </div>
        ) : null}
      </div>

      {/* Table container: allow horizontal scroll on small screens */}
      <div className="rounded-2xl border border-black/10 bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <JobsTable jobs={jobs} />
          </div>
        </div>
      </div>
    </div>
  )
}
