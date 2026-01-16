import Image from "next/image"
import Link from "next/link"

export type ArticleRowData = {
  title: string
  date: string
  excerpt: string
  image: string
  href: string
  readTime?: string
}

export default function ArticleRow({ article }: { article: ArticleRowData }) {
  return (
    <article className="group grid grid-cols-1 gap-6 py-8 sm:grid-cols-[220px_1fr] sm:gap-8">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/[0.04]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 220px"
        />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-black/40">
          {article.date}
        </p>

        <h2 className="mt-2 text-[20px] font-medium leading-snug tracking-tight sm:text-[22px]">
          {article.title}
        </h2>

        <p className="mt-3 max-w-[640px] text-[14px] leading-relaxed text-black/60">
          {article.excerpt}
        </p>

        <Link
          href={article.href}
          className="mt-4 inline-flex w-fit items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-black/50 transition hover:text-black"
        >
          Lire la suite →
        </Link>
      </div>
    </article>
  )
}
