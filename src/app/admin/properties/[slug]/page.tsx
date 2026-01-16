"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PropertyForm from "@/components/admin/PropertyForm"

export default function EditPropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [slug, setSlug] = useState<string | null>(null)
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    params.then((p) => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (slug) fetchProperty()
  }, [slug])

  async function fetchProperty() {
    if (!slug) return
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/properties/${slug}`)
      if (!res.ok) throw new Error("Propriété introuvable")
      const data = await res.json()
      setProperty(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(data: any) {
    if (!slug) return
    try {
      setSaving(true)
      setError("")

      const res = await fetch(`/api/admin/properties/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erreur lors de la mise à jour")
      }

      router.push("/admin/properties")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-8">
        <p className="text-center text-black/60">Chargement...</p>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <p className="text-center text-red-700">{error || "Propriété introuvable"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-light tracking-tight">Éditer la propriété</h1>
        <p className="mt-1 text-sm text-black/60">{property.title}</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <PropertyForm initialData={property} onSubmit={handleSubmit} saving={saving} />
    </div>
  )
}
