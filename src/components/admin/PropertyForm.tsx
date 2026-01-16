"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import AdminCard from "@/components/admin/ui/card"
import AdminInput from "@/components/admin/ui/input"
import AdminTextarea from "@/components/admin/ui/textarea"
import ImageUpload from "@/components/admin/ImageUpload"
import ImageGallery from "@/components/admin/ImageGallery"
import { slugify } from "@/lib/admin/slug"

interface PropertyFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  saving: boolean
}

export default function PropertyForm({ initialData, onSubmit, saving }: PropertyFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [location, setLocation] = useState(initialData?.location || "")
  const [description, setDescription] = useState(
    initialData?.description ||
    (initialData?.paragraphs ? initialData.paragraphs.join("\n\n") : "")
  )
  const [mainImage, setMainImage] = useState("")
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || [])
  const [owner, setOwner] = useState(initialData?.owner || "")
  const [program, setProgram] = useState(initialData?.program || "")
  const [cost, setCost] = useState(initialData?.cost || "")
  const [area, setArea] = useState(initialData?.area || "")
  const [mission, setMission] = useState(initialData?.mission || "")
  const [year, setYear] = useState(initialData?.year || "")
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "")
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "")

  const isEdit = !!initialData
  const folder = initialData?.folder || (slug ? slugify(slug) : "temp")

  useEffect(() => {
    if (!isEdit && title && !slug) {
      setSlug(slugify(title))
    }
  }, [title, isEdit, slug])

  useEffect(() => {
    if (initialData?.heroFile && initialData?.folder) {
      setMainImage(`/properties/${initialData.folder}/${initialData.heroFile}`)
    }
  }, [initialData])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      alert("Le titre est requis")
      return
    }

    const heroFile = mainImage ? mainImage.split("/").pop() || "" : ""

    const data = {
      title,
      slug,
      location,
      description: description.trim(),
      heroFile,
      gallery,
      owner,
      program,
      cost,
      area,
      mission,
      year,
      seoTitle,
      seoDescription,
      folder: isEdit ? initialData?.folder : folder,
    }

    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminCard>
        <h2 className="mb-3 text-lg font-medium">Informations générales</h2>
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-black/70">
                Titre <span className="text-red-500">*</span>
              </label>
              <AdminInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Résidence service à Saint Jean d'Ardières"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-black/70">Slug</label>
              <AdminInput
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="residence-service-saint-jean"
                disabled={isEdit}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-black/70">Localisation</label>
              <AdminInput
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Saint-Jean-d'Ardières - Rhône"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-black/70">Maître d'ouvrage</label>
              <AdminInput value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Ex: SAS AMPELOPSIS" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-black/70">Année</label>
              <AdminInput value={year} onChange={(e) => setYear(e.target.value)} placeholder="Ex: 2018" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-black/70">Coût</label>
              <AdminInput value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Ex: 3 876 636 €" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-black/70">Surface</label>
              <AdminInput value={area} onChange={(e) => setArea(e.target.value)} placeholder="Ex: 2 500 m² SP" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-black/70">Mission</label>
              <AdminInput value={mission} onChange={(e) => setMission(e.target.value)} placeholder="Ex: Complète + EXE" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-black/70">Programme</label>
              <AdminTextarea
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                placeholder="Ex: Construction de 37 logements en résidence service"
                rows={2}
              />
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="mb-3 text-lg font-medium">Description</h2>
        <AdminTextarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du projet..."
          rows={12}
        />
      </AdminCard>

      <AdminCard>
        <h2 className="mb-3 text-lg font-medium">Image principale</h2>
        <ImageUpload
          value={mainImage}
          onChange={setMainImage}
          folder={folder}
          type="properties"
        />
      </AdminCard>

      <AdminCard>
        <h2 className="mb-3 text-lg font-medium">Galerie d'images</h2>
        <ImageGallery
          images={gallery}
          onChange={setGallery}
          folder={folder}
          type="properties"
        />
      </AdminCard>

      <AdminCard>
        <h2 className="mb-3 text-lg font-medium">SEO</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black/70">Titre SEO</label>
            <AdminInput
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Titre optimisé pour les moteurs de recherche"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-black/70">Description SEO</label>
            <AdminTextarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Description optimisée pour les moteurs de recherche"
              rows={2}
            />
          </div>
        </div>
      </AdminCard>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-black/85 disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/properties")}
          className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
