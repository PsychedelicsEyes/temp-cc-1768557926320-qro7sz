"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ArticleForm from "@/components/admin/ArticleForm"

export default function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [slug, setSlug] = useState<string | null>(null)
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    params.then((p) => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (slug) fetchArticle()
  }, [slug])

  async function fetchArticle() {
    if (!slug) return
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/articles`)
      if (!res.ok) throw new Error("Erreur lors du chargement")
      const articles = await res.json()
      const found = articles.find((a: any) => a.slug === slug)
      if (!found) throw new Error("Article introuvable")
      setArticle(found)
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

      const res = await fetch(`/api/admin/articles/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erreur lors de la mise à jour")
      }

      router.push("/admin/articles")
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

  if (error || !article) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <p className="text-center text-red-700">{error || "Article introuvable"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-light tracking-tight">Éditer l'article</h1>
        <p className="mt-1 text-sm text-black/60">{article.title}</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <ArticleForm initialData={article} onSubmit={handleSubmit} saving={saving} />
    </div>
  )
}
