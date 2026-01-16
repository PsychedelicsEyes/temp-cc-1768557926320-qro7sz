"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import AdminCard from "@/components/admin/ui/card"
import AdminInput from "@/components/admin/ui/input"

interface Article {
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
}

const ITEMS_PER_PAGE = 10

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filtered, setFiltered] = useState<Article[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    const term = search.toLowerCase()
    setFiltered(
      articles.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.author.toLowerCase().includes(term)
      )
    )
    setCurrentPage(1)
  }, [search, articles])

  async function fetchArticles() {
    try {
      setLoading(true)
      setError("")
      const res = await fetch("/api/admin/articles")
      if (!res.ok) throw new Error("Erreur lors du chargement")
      const data = await res.json()
      setArticles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }

  async function deleteArticle(slug: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return

    try {
      const res = await fetch(`/api/admin/articles/${slug}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erreur lors de la suppression")
      setArticles(articles.filter((a) => a.slug !== slug))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur")
    }
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedArticles = filtered.slice(startIndex, endIndex)

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[24px] font-light tracking-tight">Articles</h1>
            <p className="mt-1 text-sm text-black/60">Gérer vos articles et publications</p>
          </div>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/85"
          >
            <Plus className="h-4 w-4" />
            Nouvel article
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-black/40" />
          <AdminInput
            placeholder="Rechercher par titre ou auteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {error && (
        <AdminCard className="border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </AdminCard>
      )}

      {loading ? (
        <AdminCard>
          <p className="py-8 text-center text-black/60">Chargement...</p>
        </AdminCard>
      ) : filtered.length === 0 ? (
        <AdminCard>
          <p className="py-8 text-center text-black/60">
            {search ? "Aucun article trouvé" : "Aucun article pour le moment"}
          </p>
        </AdminCard>
      ) : (
        <>
          <div className="grid gap-4">
            {paginatedArticles.map((article) => (
              <AdminCard key={article.slug} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-black">{article.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-black/60">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{new Date(article.date).toLocaleDateString("fr-FR")}</span>
                  </div>
                  {article.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-black/60">{article.excerpt}</p>
                  )}
                </div>
                <div className="ml-4 flex shrink-0 gap-2">
                  <Link
                    href={`/admin/articles/${article.slug}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/15 bg-white hover:bg-black/[0.03]"
                    title="Éditer"
                  >
                    <Edit2 className="h-4 w-4 text-black/70" />
                  </Link>
                  <button
                    onClick={() => deleteArticle(article.slug)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 hover:bg-red-100"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </AdminCard>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <p className="text-sm text-black/60">
                Page {currentPage} sur {totalPages} ({filtered.length} article{filtered.length > 1 ? "s" : ""})
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-black/15 bg-white px-3 text-sm font-medium text-black/70 hover:bg-black/[0.03] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "border border-black/15 bg-white text-black/70 hover:bg-black/[0.03]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-black/15 bg-white px-3 text-sm font-medium text-black/70 hover:bg-black/[0.03] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
