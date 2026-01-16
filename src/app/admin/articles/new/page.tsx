"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ArticleForm from "@/components/admin/ArticleForm"

export default function NewArticlePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(data: any) {
    try {
      setSaving(true)
      setError("")

      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erreur lors de la création")
      }

      router.push("/admin/articles")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-light tracking-tight">Nouvel article</h1>
        <p className="mt-1 text-sm text-black/60">Créer un nouvel article</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <ArticleForm onSubmit={handleSubmit} saving={saving} />
    </div>
  )
}
