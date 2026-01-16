"use client"

import type { JobStatus } from "@/lib/admin/types"

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export default function StatusBadge({ status }: { status: JobStatus }) {
  const map: Record<JobStatus, { label: string; cls: string }> = {
    queued: { label: "En attente", cls: "bg-black/[0.04] text-black/70 border-black/10" },
    running: { label: "En cours", cls: "bg-black/[0.04] text-black border-black/15" },
    done: { label: "Terminé", cls: "bg-black/[0.05] text-black border-black/10" },
    error: { label: "Erreur", cls: "bg-red-50 text-red-700 border-red-200" },
    canceled: { label: "Annulé", cls: "bg-black/[0.04] text-black/50 border-black/10" },
  }

  const s = map[status]
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.22em]",
        s.cls
      )}
    >
      {s.label}
    </span>
  )
}
