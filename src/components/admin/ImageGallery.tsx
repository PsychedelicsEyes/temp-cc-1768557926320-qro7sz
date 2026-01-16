"use client"

import { useState, useRef } from "react"
import { Upload, X, GripVertical } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  onChange: (images: string[]) => void
  folder: string
  type?: "properties" | "articles"
}

export default function ImageGallery({ images, onChange, folder, type = "properties" }: ImageGalleryProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} n'est pas une image`)
        return false
      }
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert(`${file.name} dépasse 10 Mo`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    try {
      setUploading(true)
      const uploadedUrls: string[] = []

      for (const file of validFiles) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", folder)
        formData.append("type", type)

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Erreur lors de l'upload")
        }

        const data = await res.json()
        uploadedUrls.push(data.url)
      }

      onChange([...images, ...uploadedUrls])
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur lors de l'upload")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  function moveImage(fromIndex: number, toIndex: number) {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-black/10 bg-white">
            <img src={image} alt={`Image ${index + 1}`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-600 shadow-lg hover:bg-red-50"
                title="Supprimer"
              >
                <X className="h-4 w-4" />
              </button>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black shadow-lg hover:bg-black/5"
                  title="Déplacer vers la gauche"
                >
                  ←
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index + 1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black shadow-lg hover:bg-black/5"
                  title="Déplacer vers la droite"
                >
                  →
                </button>
              )}
            </div>
            <div className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
              {index + 1}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-black/15 bg-white hover:border-black/25 hover:bg-black/[0.02] disabled:opacity-50"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black/70"></div>
              <span className="text-xs text-black/60">Upload...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                <Upload className="h-5 w-5 text-black/50" />
              </div>
              <div className="text-xs font-medium text-black/70">Ajouter</div>
            </div>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 && (
        <p className="text-xs text-black/50">
          {images.length} image{images.length > 1 ? "s" : ""} dans la galerie
        </p>
      )}
    </div>
  )
}
