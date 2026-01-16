"use client"

import { CheckCircle2, Clock } from "lucide-react"

interface PublishBoxProps {
  onSubmit: () => void
  onCancel: () => void
  saving: boolean
  isEdit?: boolean
}

export default function PublishBox({ onSubmit, onCancel, saving, isEdit = false }: PublishBoxProps) {
  return (
    <div className="sticky top-6 rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <span className="text-black/60">Prêt à publier</span>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={saving}
          className="w-full rounded-lg bg-[#2271b1] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#135e96] disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Publier"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg border border-black/15 px-4 py-2.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
