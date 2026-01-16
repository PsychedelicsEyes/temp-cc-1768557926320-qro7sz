import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Calendar,
  Tag,
  User,
  Clock,
  ExternalLink,
} from "lucide-react";

import { ARTICLES } from "@/lib/articles.data";
import { getArticleBySlug } from "@/lib/articles.server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article introuvable" };

  const description = article.excerpt ?? article.subtitle ?? article.title;

  return {
    title: `${article.title} — Study Case`,
    description,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      publishedTime: article.date,
      images: article.cover?.src ? [{ url: article.cover.src, alt: article.cover.alt ?? article.title }] : undefined,
    },
  };
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function MetaPill({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
      <Icon className="h-3.5 w-3.5" />
      <span className="truncate">{children}</span>
    </span>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  last,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={cx("py-3.5", !last && "border-b border-black/5")}>
      <div className="flex items-start justify-between gap-6">
        <dt className="inline-flex items-center gap-2 text-black/45">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </dt>
        <dd className="text-right font-medium text-black/70">{value}</dd>
      </div>
    </div>
  );
}

export default async function ArticleSlugPage({ params }: PageProps) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <section className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black/45 transition hover:text-black"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour aux articles
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {article.date ? (
              <MetaPill icon={Calendar}>{article.date}</MetaPill>
            ) : null}
            {article.readTime ? (
              <MetaPill icon={Clock}>{article.readTime}</MetaPill>
            ) : null}
          </div>
        </div>

        <div className="mt-6 h-[1px] w-full bg-black/10" />
        <div className="mt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/45">
            Article
          </p>

          <h1 className="mt-3 text-[34px] font-light leading-[0.98] tracking-tight sm:text-[48px] lg:text-[56px]">
            {article.title}
          </h1>

          {article.subtitle ? (
            <p className="mt-3 max-w-[70ch] text-[14px] leading-relaxed text-black/55 sm:text-[15px]">
              {article.subtitle}
            </p>
          ) : null}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            {article.cover?.src ? (
              <div className="border border-black/10 bg-white p-2 sm:p-3">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={article.cover.src}
                    alt={article.cover.alt ?? article.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                </div>
                {article.cover.caption ? (
                  <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.22em] text-black/35">
                    {article.cover.caption}
                  </p>
                ) : null}
              </div>
            ) : null}
            <article className="mt-6 border border-black/10 bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-[2px] w-12 bg-black/70" />
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/60">
                  Contenu
                </h2>
              </div>

              <div className="space-y-5 text-[14px] leading-relaxed text-black/60">
                {Array.isArray(article.blocks) && article.blocks.length > 0 ? (
                  article.blocks.map((b: any, i: number) => {
                    if (b.type === "quote") {
                      return (
                        <blockquote
                          key={i}
                          className="border-l-2 border-black/20 pl-4 text-black/65"
                        >
                          <p className="text-[15px] italic leading-relaxed">
                            “{b.text}”
                          </p>
                        </blockquote>
                      );
                    }

                    if (b.type === "image" && b.src) {
                      return (
                        <figure key={i} className="space-y-3">
                          <div className="relative aspect-[16/9] w-full overflow-hidden border border-black/10 bg-black/[0.02]">
                            <Image
                              src={b.src}
                              alt={b.alt ?? article.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 66vw"
                              className="object-cover"
                            />
                          </div>
                          {b.caption ? (
                            <figcaption className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/35">
                              {b.caption}
                            </figcaption>
                          ) : null}
                        </figure>
                      );
                    }
                    return <p key={i}>{b.text}</p>;
                  })
                ) : Array.isArray(article.paragraphs) ? (
                  article.paragraphs.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))
                ) : (
                  <p>{article.excerpt ?? "Contenu à venir."}</p>
                )}
              </div>

              {article.sourceUrl ? (
                <div className="mt-8 border-t border-black/10 pt-6">
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45 transition hover:text-black"
                  >
                    Source / lien
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : null}
            </article>
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-10">
              <div className="border border-black/10 bg-white">
                <div className="border-b border-black/10 px-6 py-5">
                  <div className="h-[2px] w-12 bg-black/70" />
                  <h2 className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/60">
                    Infos
                  </h2>
                </div>

                <dl className="px-6 py-5 text-[13px]">
                  {article.author ? (
                    <InfoRow
                      icon={User}
                      label="Auteur"
                      value={article.author}
                    />
                  ) : null}

                  {article.date ? (
                    <InfoRow
                      icon={Calendar}
                      label="Date"
                      value={article.date}
                    />
                  ) : null}

                  {article.readTime ? (
                    <InfoRow
                      icon={Clock}
                      label="Lecture"
                      value={article.readTime}
                    />
                  ) : null}

                  {Array.isArray(article.tags) && article.tags.length > 0 ? (
                    <InfoRow
                      icon={Tag}
                      label="Tags"
                      value={article.tags.join(", ")}
                      last
                    />
                  ) : (
                    <InfoRow icon={Tag} label="Tags" value="—" last />
                  )}
                </dl>
              </div>

              <div className="mt-4 border border-black/10 bg-white p-5">
                <p className="text-[12px] leading-relaxed text-black/50">
                  Pour plus d’informations, n’hésitez pas à nous contacter.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex w-full items-center justify-center border border-black/15 bg-black px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-black/85"
                >
                  Contact
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
