"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Minus,
  Plus,
  RotateCcw,
  X,
  Images,
} from "lucide-react"

type MediaAsset = { src: string; alt: string }

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export default function PropertyGallery({
  title,
  hero,
  gallery,
  bleedRight = false,
}: {
  title: string
  hero: MediaAsset
  gallery?: MediaAsset[]
  /** ✅ permet à la galerie de “mordre” sur le padding du container à droite */
  bleedRight?: boolean
}) {
  const images = useMemo(() => [hero, ...(gallery ?? [])], [hero, gallery])
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const [zoom, setZoom] = useState(1)
  const zoomRef = useRef(1)
  zoomRef.current = zoom

  const current = images[active] ?? images[0]
  const hasMany = images.length > 1

  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n))

  const navigateImage = (newIndex: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setActive(newIndex)
      setIsTransitioning(false)
    }, 150)
  }

  const prev = () => navigateImage((active - 1 + images.length) % images.length)
  const next = () => navigateImage((active + 1) % images.length)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false)
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
      if (e.key === "+" || (e.ctrlKey && e.key === "="))
        setZoom((z) => clamp(z + 0.15, 1, 2.5))
      if (e.key === "-") setZoom((z) => clamp(z - 0.15, 1, 2.5))
      if (e.key.toLowerCase() === "0") setZoom(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, active, images.length])

  useEffect(() => {
    if (!lightbox) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [lightbox])

  useEffect(() => {
    if (!lightbox) return
    setZoom(1)
  }, [lightbox, active])

  const startX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const sx = startX.current
    startX.current = null
    if (sx == null) return
    const ex = e.changedTouches[0]?.clientX
    if (typeof ex !== "number") return
    const dx = ex - sx
    if (Math.abs(dx) < 50) return
    if (dx > 0) prev()
    else next()
  }

  return (
    <>
      {/* ✅ wrapper “bleed” : si ton parent a du padding, ça va le compenser */}
      <div
        className={cx(
          "w-full",
          bleedRight &&
            "lg:relative lg:-mr-10 lg:pr-10 xl:-mr-14 xl:pr-14 2xl:-mr-16 2xl:pr-16"
        )}
      >
        <div className="relative overflow-hidden rounded-[18px] border border-black/[0.08] bg-black/[0.02] shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div
            className="relative aspect-[4/3] w-full sm:aspect-[16/9]"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className={cx(
                "absolute inset-0 transition-opacity duration-200",
                isTransitioning ? "opacity-0" : "opacity-100"
              )}
            >
              <Image
                src={current.src}
                alt={current.alt ?? title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover"
              />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/5" />

            <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2 sm:left-4 sm:right-4 sm:top-4">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/40 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                <Images className="h-3.5 w-3.5 opacity-90" />
                <span className="opacity-95">
                  {active + 1}/{images.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setLightbox(true)}
                className="group flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-200 hover:bg-black/50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
                aria-label="Ouvrir la galerie en plein écran"
              >
                <Expand className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden sm:inline">Agrandir</span>
              </button>
            </div>

            {hasMany && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="group absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/35 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-200 hover:bg-black/50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] sm:grid"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="group absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/35 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-200 hover:bg-black/50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] sm:grid"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-black/[0.06] bg-gradient-to-br from-white to-black/[0.01] px-4 py-3.5">
            <p className="truncate text-[11.5px] font-semibold uppercase tracking-[0.12em] text-black/60">
              {current.alt ?? title}
            </p>

            {hasMany ? (
              <div className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-black/[0.02] px-2.5 py-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">
                  {active + 1}/{images.length}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* thumbs */}
      {hasMany && (
        <div className="mt-4">
          <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:hidden">
            <style>{`.hide-scroll::-webkit-scrollbar{display:none}`}</style>
            <div className="hide-scroll flex gap-3">
              {images.map((img, i) => {
                const isActive = i === active
                return (
                  <button
                    key={`${img.src}-${i}`}
                    type="button"
                    onClick={() => navigateImage(i)}
                    className={cx(
                      "group relative w-44 shrink-0 overflow-hidden rounded-[16px] border bg-black/[0.015] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200",
                      isActive
                        ? "border-black/30 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                        : "border-black/[0.06] hover:border-black/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                    )}
                    aria-label={`Voir l'image ${i + 1}`}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={img.src}
                        alt={img.alt ?? title}
                        fill
                        className={cx(
                          "object-cover transition-all duration-300",
                          isActive ? "scale-[1.02]" : "group-hover:scale-105"
                        )}
                        sizes="40vw"
                      />
                    </div>
                    <div
                      className={cx(
                        "pointer-events-none absolute inset-0 rounded-[16px] transition-all duration-200",
                        isActive ? "ring-2 ring-inset ring-black/30" : "ring-0"
                      )}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="hidden sm:grid sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
            {images.map((img, i) => {
              const isActive = i === active
              return (
                <button
                  key={`${img.src}-${i}`}
                  type="button"
                  onClick={() => navigateImage(i)}
                  className={cx(
                    "group relative overflow-hidden rounded-[16px] border bg-black/[0.015] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200",
                    isActive
                      ? "border-black/30 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                      : "border-black/[0.06] hover:border-black/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                  )}
                  aria-label={`Voir l'image ${i + 1}`}
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={img.src}
                      alt={img.alt ?? title}
                      fill
                      sizes="(max-width: 1024px) 25vw, 12vw"
                      className={cx(
                        "object-cover transition-all duration-300",
                        isActive ? "scale-[1.02]" : "group-hover:scale-105"
                      )}
                    />
                  </div>
                  <div
                    className={cx(
                      "pointer-events-none absolute inset-0 rounded-[16px] transition-all duration-200",
                      isActive ? "ring-2 ring-inset ring-black/30" : "ring-0"
                    )}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* lightbox (inchangé) */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie en plein écran"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setLightbox(false)
          }}
        >
          <div className="fixed left-0 right-0 top-0 z-[110] border-b border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-3 py-3 sm:px-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                  <Images className="h-3.5 w-3.5 opacity-80" />
                  <span className="truncate">{title}</span>
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  {active + 1}/{images.length}{" "}
                  <span className="hidden sm:inline">—</span>{" "}
                  <span className="hidden sm:inline">
                    {current.alt ?? title}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => clamp(z - 0.15, 1, 2.5))}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10"
                    aria-label="Zoom -"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setZoom(1)}
                    className="inline-flex h-9 items-center justify-center rounded-full px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 transition hover:bg-white/10"
                    aria-label="Réinitialiser le zoom"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {Math.round(zoom * 100)}%
                  </button>

                  <button
                    type="button"
                    onClick={() => setZoom((z) => clamp(z + 0.15, 1, 2.5))}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10"
                    aria-label="Zoom +"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setLightbox(false)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 transition hover:bg-white/10"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Fermer</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-full flex-col pt-[64px] sm:pt-[68px]">
            <div className="relative flex-1 px-3 pb-3 sm:px-6 sm:pb-6">
              <div
                className="relative mx-auto h-full max-w-[1600px] overflow-hidden rounded-[22px] border border-white/10 bg-black"
              >
                <div className="absolute inset-0 grid place-items-center">
                  <div
                    className={cx(
                      "relative h-full w-full transition-opacity duration-200",
                      isTransitioning ? "opacity-0" : "opacity-100"
                    )}
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "center",
                      transition: "transform 180ms ease, opacity 200ms ease",
                    }}
                  >
                    <Image
                      src={current.src}
                      alt={current.alt ?? title}
                      fill
                      quality={90}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1600px"
                      className="object-contain"
                    />
                  </div>
                </div>

                {hasMany && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      className="group absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/35 text-white shadow-[0_12px_28px_rgba(0,0,0,0.4)] backdrop-blur-xl transition hover:bg-black/55 sm:grid"
                      aria-label="Image précédente"
                    >
                      <ChevronLeft className="h-6 w-6 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    </button>

                    <button
                      type="button"
                      onClick={next}
                      className="group absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/35 text-white shadow-[0_12px_28px_rgba(0,0,0,0.4)] backdrop-blur-xl transition hover:bg-black/55 sm:grid"
                      aria-label="Image suivante"
                    >
                      <ChevronRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {hasMany && (
              <div className="border-t border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="mx-auto max-w-[1600px] px-3 py-3 sm:px-6 sm:py-4">
                  <div className="flex items-center gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
                    <style>{`.lb-scroll::-webkit-scrollbar{display:none}`}</style>
                    <div className="lb-scroll flex gap-3">
                      {images.map((img, i) => {
                        const isA = i === active
                        return (
                          <button
                            key={`lb-${img.src}-${i}`}
                            type="button"
                            onClick={() => navigateImage(i)}
                            className={cx(
                              "relative h-[56px] w-[92px] shrink-0 overflow-hidden rounded-[12px] border transition",
                              isA
                                ? "border-white/50 ring-2 ring-white/20"
                                : "border-white/10 hover:border-white/25"
                            )}
                            aria-label={`Aller à l'image ${i + 1}`}
                          >
                            <Image
                              src={img.src}
                              alt={img.alt ?? title}
                              fill
                              sizes="120px"
                              className="object-cover"
                            />
                            <div
                              className={cx(
                                "absolute inset-0 transition",
                                isA
                                  ? "bg-black/10"
                                  : "bg-black/35 hover:bg-black/20"
                              )}
                            />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between sm:hidden">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => clamp(z - 0.15, 1, 2.5))}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85"
                    >
                      <Minus className="h-4 w-4" />
                      Zoom
                    </button>

                    <button
                      type="button"
                      onClick={() => setZoom(1)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85"
                    >
                      <RotateCcw className="h-4 w-4" />
                      {Math.round(zoom * 100)}%
                    </button>

                    <button
                      type="button"
                      onClick={() => setZoom((z) => clamp(z + 0.15, 1, 2.5))}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85"
                    >
                      <Plus className="h-4 w-4" />
                      Zoom
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
