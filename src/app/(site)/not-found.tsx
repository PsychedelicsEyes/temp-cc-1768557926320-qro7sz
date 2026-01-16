
import Link from "next/link"
import { ArrowLeft, Home, Mail, LayoutGrid } from "lucide-react"

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function CardLink({
  href,
  title,
  desc,
  icon,
}: {
  href: string
  title: string
  desc: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cx(
        "group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-5 transition",
        "hover:border-black/20 hover:bg-black/[0.02]"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/[0.05] to-transparent opacity-0 transition group-hover:opacity-100"
      />

      <div className="flex items-start gap-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-black/70 transition group-hover:border-black/20 group-hover:text-black">
          {icon}
        </span>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tracking-tight">{title}</span>
            <span className="text-black/25 transition group-hover:translate-x-0.5 group-hover:text-black/45">
              →
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-black/55">{desc}</p>
        </div>
      </div>
    </Link>
  )
}

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full bg-white text-black">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 450px at 20% 20%, rgba(0,0,0,0.06), transparent 60%), radial-gradient(900px 450px at 80% 30%, rgba(0,0,0,0.04), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.12) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(55% 45% at 50% 35%, black 50%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(55% 45% at 50% 35%, black 50%, transparent 90%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.45) 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-[1100px] items-center px-4 py-16 sm:px-6 lg:px-10">
        <div className="w-full">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[620px]">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/45">
                Erreur 404
              </p>

              <h1 className="mt-4 text-[44px] font-light leading-[1.02] tracking-tight sm:text-[60px]">
                Cette page n’existe pas.
              </h1>

              <p className="mt-5 text-sm leading-7 text-black/60">
                La page a peut-être été déplacée, supprimée, ou l’URL est incorrecte.
                Revenez à un point sûr et continuez votre navigation.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/"
                  className={cx(
                    "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm transition",
                    "border-black bg-black text-white hover:bg-black/90"
                  )}
                >
                  <Home className="h-4 w-4" />
                  Accueil
                </Link>

                <Link
                  href="/"
                  className={cx(
                    "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm transition",
                    "border-black/15 bg-white text-black hover:border-black/25 hover:bg-black/[0.02]"
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Link>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                <CardLink
                  href="/articles"
                  title="Articles"
                  desc="Dernières actualités et publications."
                  icon={<LayoutGrid className="h-5 w-5" />}
                />
                <CardLink
                  href="/contact"
                  title="Contact"
                  desc="Une question ? Écrivez-nous."
                  icon={<Mail className="h-5 w-5" />}
                />
              </div>
            </div>
            <div className="relative select-none">
              <div className="absolute -inset-8 rounded-[40px] border border-black/10 bg-white/60 backdrop-blur-sm" />
              <div className="relative rounded-[40px] border border-black/10 bg-white px-10 py-12">
                <div className="text-[120px] font-light leading-none tracking-tight text-black/12 sm:text-[160px]">
                  404
                </div>
                <div className="mt-4 h-px w-full bg-black/10" />
                <p className="mt-4 text-xs uppercase tracking-[0.28em] text-black/45">
                  Page introuvable
                </p>
                <p className="mt-2 max-w-[32ch] text-sm leading-6 text-black/60">
                  Essayez de repartir depuis l’accueil ou consultez les pages
                  principales ci-contre.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 h-px w-full bg-black/10" />
          <p className="mt-6 text-xs text-black/45">
            Si le problème persiste, vous pouvez nous contacter via{" "}
            <Link
              href="/contact"
              className="underline decoration-black/15 underline-offset-4 hover:decoration-black/30"
            >
              la page contact
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
