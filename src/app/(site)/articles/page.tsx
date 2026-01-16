import { Metadata } from "next"
import Link from "next/link"
import ArticleRow from "@/components/articles/ArticleRow"
import { getArticles } from "@/lib/articles.server"

export const metadata: Metadata = {
  title: "Articles & Actualités — Study Case | Agence d'architecture",
  description: "Suivez l'actualité de Study Case : projets en cours, réalisations récentes, insights sur l'architecture et le design.",
  openGraph: {
    title: "Articles & Actualités — Study Case",
    description: "Suivez l'actualité de Study Case : projets en cours, réalisations récentes, insights sur l'architecture et le design.",
    type: "website",
  },
}

type SearchParams = { page?: string }

function pageHref(page: number) {
  return page <= 1 ? "/articles" : `/articles?page=${page}`
}

function getPage(value: string | undefined) {
  const n = Number.parseInt(value ?? "1", 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function buildPages(page: number, totalPages: number) {
  const windowSize = 2
  const start = Math.max(1, page - windowSize)
  const end = Math.min(totalPages, page + windowSize)
  const out: Array<number | "dots"> = []

  if (start > 1) {
    out.push(1)
    if (start > 2) out.push("dots")
  }

  for (let p = start; p <= end; p++) out.push(p)

  if (end < totalPages) {
    if (end < totalPages - 1) out.push("dots")
    out.push(totalPages)
  }

  return out
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null

  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages
  const pages = buildPages(page, totalPages)

  const base = "px-3 py-1 text-sm transition"
  const idle = "text-black/40 hover:text-black"
  const disabled = "text-black/20 pointer-events-none"
  const current = "text-black font-medium"

  return (
    <nav className="mt-16 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        aria-label="Page précédente"
        href={pageHref(page - 1)}
        className={`${base} ${prevDisabled ? disabled : idle}`}
      >
        ‹
      </Link>

      {pages.map((p, i) =>
        p === "dots" ? (
          <span key={`dots-${i}`} className="px-2 py-1 text-sm text-black/30">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${base} ${p === page ? current : idle}`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        aria-label="Page suivante"
        href={pageHref(page + 1)}
        className={`${base} ${nextDisabled ? disabled : idle}`}
      >
        ›
      </Link>
    </nav>
  )
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const all = await getArticles()

  const articles = [...all].sort((a, b) => {
    const da = new Date(a.date).getTime()
    const db = new Date(b.date).getTime()
    return (Number.isFinite(db) ? db : 0) - (Number.isFinite(da) ? da : 0)
  })

  const PAGE_SIZE = 10
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE))

  const page = clamp(getPage(sp.page), 1, totalPages)
  const start = (page - 1) * PAGE_SIZE
  const items = articles.slice(start, start + PAGE_SIZE)

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <section className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
        <header className="mb-12">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/40">
            Actualités
          </p>
          <h1 className="mt-3 text-[42px] font-light leading-[1] tracking-tight sm:text-[56px]">
            Articles
          </h1>
        </header>

        <div className="divide-y divide-black/10">
          {items.map((article) => (
            <ArticleRow
              key={article.slug}
              article={{
                title: article.title,
                date: article.date,
                excerpt: article.excerpt ?? article.subtitle ?? "",
                image: article.cover?.src ?? "",
                href: `/articles/${article.slug}`,
                readTime: article.readTime,
              }}
            />
          ))}
        </div>

        <Pagination page={page} totalPages={totalPages} />
      </section>
    </main>
  )
}
