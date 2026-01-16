"use client"

import { useMemo, useState } from "react"
import type { AdminJob } from "@/lib/admin/types"
import { cancelJob, deleteJob } from "@/lib/admin/api"
import { Ban, Trash2, Loader2, X, AlertTriangle } from "lucide-react"

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function pct(job: AdminJob) {
  const p = job.progress
  if (!p || !p.total) return 0
  return Math.round(((p.ok + p.fail) / p.total) * 100)
}

function badge(status: AdminJob["status"]) {
  if (status === "done") return "TERMINÉ"
  if (status === "running") return "EN COURS"
  if (status === "queued") return "EN ATTENTE"
  if (status === "canceled") return "ANNULÉ"
  return "ERREUR"
}

/* ------------------------------ Confirm Modal ------------------------------ */

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  danger = true,
  busy,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  busy?: boolean
  onConfirm: () => void | Promise<void>
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={busy ? undefined : onClose}
        className={cx(
          "absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-opacity",
          busy ? "cursor-not-allowed" : ""
        )}
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <div className="flex items-start gap-4 px-6 pt-6">
            <div
              className={cx(
                "mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full border",
                danger ? "border-black/15 bg-black/[0.03] text-black/70" : "border-black/10"
              )}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold tracking-tight text-black">
                {title}
              </div>
              {description ? (
                <div className="mt-2 text-sm leading-relaxed text-black/60">
                  {description}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={busy ? undefined : onClose}
              aria-label="Fermer"
              className={cx(
                "inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-black/60 hover:bg-black/[0.03]",
                busy ? "cursor-not-allowed opacity-60" : ""
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-black/10 bg-black/[0.01] px-6 py-4">
            <button
              type="button"
              onClick={busy ? undefined : onClose}
              className={cx(
                "inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-4 py-2 text-[12px] uppercase tracking-[0.22em] text-black/70 hover:bg-black/[0.03]",
                busy ? "cursor-not-allowed opacity-60" : ""
              )}
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={busy ? undefined : onConfirm}
              className={cx(
                "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-[12px] uppercase tracking-[0.22em] transition",
                danger
                  ? "border-black/15 bg-black text-white hover:bg-black/90"
                  : "border-black/15 bg-white text-black/75 hover:bg-black/[0.03]",
                busy ? "cursor-not-allowed opacity-60" : ""
              )}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Table --------------------------------- */

export default function JobsTable({
  jobs,
  onChanged,
}: {
  jobs: AdminJob[]
  onChanged?: () => void
}) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [bulkBusy, setBulkBusy] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmMode, setConfirmMode] = useState<"one" | "all">("one")
  const [targetId, setTargetId] = useState<string | null>(null)

  const deletableJobs = useMemo(
    () => jobs.filter((j) => j.status === "done" || j.status === "error" || j.status === "canceled"),
    [jobs]
  )

  const deletableCount = deletableJobs.length

  async function onCancel(id: string) {
    setBusyId(id)
    try {
      await cancelJob(id)
      onChanged?.()
    } finally {
      setBusyId(null)
    }
  }

  function askDeleteOne(id: string) {
    setTargetId(id)
    setConfirmMode("one")
    setConfirmOpen(true)
  }

  function askDeleteAll() {
    setTargetId(null)
    setConfirmMode("all")
    setConfirmOpen(true)
  }

  async function doDeleteOne(id: string) {
    setBusyId(id)
    try {
      await deleteJob(id)
      onChanged?.()
    } finally {
      setBusyId(null)
    }
  }

  async function doDeleteAll() {
    // supprime seulement les jobs supprimables
    setBulkBusy(true)
    try {
      for (const j of deletableJobs) {
        await deleteJob(j.id)
      }
      onChanged?.()
    } finally {
      setBulkBusy(false)
    }
  }

  return (
    <>
      {/* header actions */}
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">
          Actions
        </div>

        <button
          type="button"
          disabled={deletableCount === 0 || bulkBusy || !!busyId}
          onClick={askDeleteAll}
          className={cx(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] uppercase tracking-[0.22em] transition",
            deletableCount === 0 || bulkBusy || !!busyId
              ? "cursor-not-allowed border-black/10 bg-black/[0.03] text-black/35"
              : "border-black/15 bg-white text-black/70 hover:bg-black/[0.03]"
          )}
        >
          {bulkBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Tout supprimer
          <span className="ml-1 rounded-full border border-black/15 bg-white px-2 py-0.5 text-[11px] tracking-[0.18em] text-black/55">
            {deletableCount}
          </span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <table className="w-full">
          <thead className="bg-black/[0.02]">
            <tr className="text-left text-[11px] uppercase tracking-[0.28em] text-black/45">
              <th className="px-6 py-4">Job</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4">Créé</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-sm text-black/45">
                  Aucun job.
                </td>
              </tr>
            ) : (
              jobs.map((j) => {
                const busy = busyId === j.id || bulkBusy
                const canCancel = j.status === "queued" || j.status === "running"
                const canDelete = j.status === "done" || j.status === "error" || j.status === "canceled"

                return (
                  <tr key={j.id} className="border-t border-black/10">
                    <td className="px-6 py-4 font-mono text-sm text-black/70">{j.id}</td>
                    <td className="px-6 py-4 text-sm text-black/70">{j.type}</td>

                    <td className="px-6 py-4">
                      <span className="rounded-full border border-black/15 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-black/70">
                        {badge(j.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {j.progress?.total ? (
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-56 overflow-hidden rounded-full bg-black/10">
                            <div
                              className="h-full bg-black/70 transition-all"
                              style={{ width: `${pct(j)}%` }}
                            />
                          </div>
                          <div className="text-sm text-black/60">
                            {pct(j)}%{" "}
                            <span className="text-black/35">
                              ({j.progress.ok}/{j.progress.total}, fail {j.progress.fail})
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-black/30">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-black/60">{j.createdAt}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {canCancel ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => onCancel(j.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-black/70 hover:bg-black/[0.03] disabled:opacity-50"
                          >
                            {busyId === j.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Ban className="h-3.5 w-3.5" />
                            )}
                            Annuler
                          </button>
                        ) : null}

                        {canDelete ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => askDeleteOne(j.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-black/70 hover:bg-black/[0.03] disabled:opacity-50"
                          >
                            {busyId === j.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            Supprimer
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title={
          confirmMode === "all"
            ? "Supprimer tous les jobs terminés ?"
            : "Supprimer ce job ?"
        }
        description={
          confirmMode === "all"
            ? `Cette action supprimera ${deletableCount} job(s) (done/error/canceled). Les jobs en cours ne seront pas supprimés.`
            : "Cette action est définitive."
        }
        confirmLabel={confirmMode === "all" ? "Tout supprimer" : "Supprimer"}
        cancelLabel="Annuler"
        danger
        busy={bulkBusy || (confirmMode === "one" && !!targetId && busyId === targetId)}
        onClose={() => {
          if (bulkBusy) return
          if (busyId && confirmMode === "one") return
          setConfirmOpen(false)
        }}
        onConfirm={async () => {
          if (confirmMode === "all") {
            await doDeleteAll()
            setConfirmOpen(false)
            return
          }
          if (targetId) {
            await doDeleteOne(targetId)
            setConfirmOpen(false)
          }
        }}
      />
    </>
  )
}
