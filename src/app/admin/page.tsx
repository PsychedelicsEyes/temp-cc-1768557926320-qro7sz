import Link from "next/link"

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">Vue d'ensemble</div>
        <h1 className="mt-2 text-[30px] font-light tracking-tight">Dashboard</h1>
        <p className="mt-3 text-sm text-black/60">
          Système CMS complet pour gérer vos propriétés et articles
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/properties"
            className="rounded-2xl border border-black/10 bg-white p-5 hover:bg-black/[0.02]"
          >
            <h3 className="font-medium text-black">Propriétés</h3>
            <p className="mt-1 text-sm text-black/60">Gérer vos propriétés immobilières</p>
          </Link>
          <Link
            href="/admin/articles"
            className="rounded-2xl border border-black/10 bg-white p-5 hover:bg-black/[0.02]"
          >
            <h3 className="font-medium text-black">Articles</h3>
            <p className="mt-1 text-sm text-black/60">Gérer vos articles et publications</p>
          </Link>
          <Link
            href="/admin/upscale"
            className="rounded-2xl border border-black/10 bg-white p-5 hover:bg-black/[0.02]"
          >
            <h3 className="font-medium text-black">Upscale</h3>
            <p className="mt-1 text-sm text-black/60">Optimiser vos images</p>
          </Link>
          <Link
            href="/admin/jobs"
            className="rounded-2xl border border-black/10 bg-white p-5 hover:bg-black/[0.02]"
          >
            <h3 className="font-medium text-black">Jobs</h3>
            <p className="mt-1 text-sm text-black/60">Suivre les tâches en cours</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
