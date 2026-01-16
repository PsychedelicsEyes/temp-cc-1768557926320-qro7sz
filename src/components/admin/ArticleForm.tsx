"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { slugify } from "@/lib/admin/slug"
import AdminCard from "@/components/admin/ui/card"
import AdminInput from "@/components/admin/ui/input"
import AdminTextarea from "@/components/admin/ui/textarea"
import BlockEditor from "@/components/admin/BlockEditor"
import ImageUpload from "@/components/admin/ImageUpload"
import SidebarPanel from "@/components/admin/ui/sidebarPanel"
import PublishBox from "@/components/admin/ui/publishBox"
import { X } from "lucide-react"

interface ArticleFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  saving: boolean
}

export default function ArticleForm({ initialData, onSubmit, saving }: ArticleFormProps) {
  const router = useRouter()
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [title, setTitle] = useState(initialData?.title || "")
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split("T")[0]
  )
  const [author, setAuthor] = useState(initialData?.author || "Study Case")
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [readTime, setReadTime] = useState(initialData?.readTime || "2 min")
  const [blocks, setBlocks] = useState(initialData?.blocks || [])
  const [coverSrc, setCoverSrc] = useState(initialData?.cover?.src || "")
  const [coverAlt, setCoverAlt] = useState(initialData?.cover?.alt || "")
  const [coverCaption, setCoverCaption] = useState(initialData?.cover?.caption || "")

  const isEdit = !!initialData

  useEffect(() => {
    if (!isEdit && title && !slug) {
      setSlug(slugify(title))
    }
  }, [title, isEdit, slug])

  function addTag() {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput("")
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !slug.trim()) {
      alert("Le titre et le slug sont requis")
      return
    }

    const data = {
      slug,
      title,
      subtitle,
      excerpt,
      date,
      readTime,
      author,
      tags,
      cover: {
        src: coverSrc,
        alt: coverAlt,
        caption: coverCaption,
      },
      blocks,
    }

    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ajouter un titre"
              className="w-full border-0 bg-transparent text-4xl font-bold outline-none placeholder:text-black/20"
              required
            />
          </div>

          {subtitle && (
            <div>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Sous-titre"
                className="w-full border-0 bg-transparent text-xl font-light outline-none placeholder:text-black/20"
              />
            </div>
          )}

          <AdminCard>
            <ImageUpload
              value={coverSrc}
              onChange={setCoverSrc}
              folder={slug || "general"}
              type="articles"
              label="Image de couverture"
            />

            {coverSrc && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-black/60">Texte alternatif</label>
                  <AdminInput
                    value={coverAlt}
                    onChange={(e) => setCoverAlt(e.target.value)}
                    placeholder="Description de l'image"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-black/60">Légende</label>
                  <AdminInput
                    value={coverCaption}
                    onChange={(e) => setCoverCaption(e.target.value)}
                    placeholder="Légende optionnelle"
                  />
                </div>
              </div>
            )}
          </AdminCard>

          <AdminCard>
            <BlockEditor blocks={blocks} onChange={setBlocks} articleSlug={slug} />
          </AdminCard>
        </div>

        <div className="w-80 shrink-0 space-y-4">
          <PublishBox
            onSubmit={() => {
              const form = document.querySelector("form")
              if (form) {
                form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
              }
            }}
            onCancel={() => router.push("/admin/articles")}
            saving={saving}
            isEdit={isEdit}
          />

          <SidebarPanel title="Publication" defaultOpen={true}>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/60">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/30"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/60">Auteur</label>
                <AdminInput value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/60">Temps de lecture</label>
                <AdminInput
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="2 min"
                />
              </div>
            </div>
          </SidebarPanel>

          <SidebarPanel title="Tags" defaultOpen={true}>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/60">Tags</label>
                <div className="flex gap-2">
                  <AdminInput
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Ajouter..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="rounded-lg bg-[#2271b1] px-3 py-2 text-xs text-white hover:bg-[#135e96]"
                  >
                    +
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-md bg-black/5 px-2 py-1 text-xs"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-black/50 hover:text-black">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SidebarPanel>

          <SidebarPanel title="Extrait" defaultOpen={false}>
            <div>
              <AdminTextarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Courte description de l'article..."
                rows={4}
              />
              <p className="mt-1 text-xs text-black/50">
                {excerpt.length} caractères
              </p>
            </div>
          </SidebarPanel>

          <SidebarPanel title="Image mise en avant" defaultOpen={false}>
            <ImageUpload
              value={coverSrc}
              onChange={setCoverSrc}
              folder={slug || "general"}
              type="articles"
              variant="compact"
            />
          </SidebarPanel>

          <SidebarPanel title="Paramètres" defaultOpen={false}>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/60">Slug</label>
                <AdminInput
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="slug-de-l-article"
                  disabled={isEdit}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/60">Sous-titre</label>
                <AdminInput
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Sous-titre optionnel"
                />
              </div>
            </div>
          </SidebarPanel>
        </div>
      </div>
    </form>
  )
}
