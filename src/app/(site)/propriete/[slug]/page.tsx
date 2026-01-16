import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import {
  ArrowLeft,
  MapPin,
  Building2,
  LayoutGrid,
  Coins,
  Ruler,
  BadgeCheck,
  CalendarDays,
} from "lucide-react"
import { PROPERTIES } from "@/lib/properties.data"
import { getPropertyBySlug } from "@/lib/properties.server"
import PropertyGallery from "@/components/PropertyGallery"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)

  if (!property) return { title: "Projet introuvable" }

  const title = property.seoTitle || `${property.title} — Study Case`
  const description = property.seoDescription || `${property.title} à ${property.location}. ${property.program || ""}`

  return {
    title,
    description,
    openGraph: {
      title: property.title,
      description,
      type: "website",
      images: property.hero?.src ? [{ url: property.hero.src, alt: property.hero.alt }] : undefined,
    },
  }
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params

  const property = await getPropertyBySlug(slug)
  if (!property) notFound()

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <section
        id="top"
        className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black/45 transition hover:text-black"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour aux projets
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
              <MapPin className="h-3.5 w-3.5" />
              {property.location}
            </span>
          </div>
        </div>
        <div className="mt-6 h-[1px] w-full bg-black/10" />
        <div className="mt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/45">
            Détails du projet
          </p>

          <h1 className="mt-3 text-[34px] font-light leading-[0.98] tracking-tight sm:text-[48px] lg:text-[56px]">
            {property.title}
          </h1>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="border border-black/10 bg-white p-2 sm:p-3">
              <PropertyGallery
                title={property.title}
                hero={property.hero}
                gallery={property.gallery}
              />
            </div>

            <div className="mt-6 border border-black/10 bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-[2px] w-12 bg-black/70" />
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/60">
                  Description
                </h2>
              </div>

              <div className="whitespace-pre-wrap text-[14px] leading-relaxed text-black/60">
                {property.description || ""}
              </div>
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-10">
              <div className="border border-black/10 bg-white">
                <div className="border-b border-black/10 px-6 py-5">
                  <div className="h-[2px] w-12 bg-black/70" />
                  <h2 className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/60">
                    Fiche projet
                  </h2>
                </div>

                <dl className="px-6 py-5 text-[13px]">
                  <Row
                    icon={MapPin}
                    label="Lieu"
                    value={property.location}
                  />
                  {property.owner ? (
                    <Row
                      icon={Building2}
                      label="Maîtrise d'ouvrage"
                      value={property.owner}
                    />
                  ) : null}
                  {property.program ? (
                    <Row
                      icon={LayoutGrid}
                      label="Programme"
                      value={property.program}
                    />
                  ) : null}
                  {property.cost ? (
                    <Row
                      icon={Coins}
                      label="Coût travaux"
                      value={property.cost}
                    />
                  ) : null}
                  {property.area ? (
                    <Row
                      icon={Ruler}
                      label="Surface"
                      value={property.area}
                    />
                  ) : null}
                  {property.mission ? (
                    <Row
                      icon={BadgeCheck}
                      label="Mission"
                      value={property.mission}
                    />
                  ) : null}
                  {property.year ? (
                    <Row
                      icon={CalendarDays}
                      label="Année"
                      value={property.year}
                      last
                    />
                  ) : null}
                </dl>
              </div>

              <div className="mt-4 border border-black/10 bg-white p-5">
                <p className="text-[12px] leading-relaxed text-black/50">
                  Dossier complet sur demande. Visuels non contractuels.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

function Row({
  icon: Icon,
  label,
  value,
  last,
}: {
  icon: React.ElementType
  label: string
  value: string
  last?: boolean
}) {
  return (
    <div className={cx(last ? "py-3.5" : "border-b border-black/5 py-3.5")}>
      <div className="flex items-start justify-between gap-6">
        <dt className="flex items-center gap-2 text-black/45">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </dt>
        <dd className="text-right font-medium text-black/70">{value}</dd>
      </div>
    </div>
  )
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}
