"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import AdminInput from "@/components/admin/ui/input"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder: string
  type?: "properties" | "articles"
  label?: string
  placeholder?: string
  variant?: "default" | "compact"
}

export default function ImageUpload({
  value,
  onChange,
  folder,
  type = "properties",
  label,
  placeholder,
  variant = "default",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [useUrl, setUseUrl] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Le fichier doit être une image")
      return
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert("L'image ne doit pas dépasser 10 Mo")
      return
    }

    try {
      setUploading(true)
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
      onChange(data.url)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur lors de l'upload")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  function clearImage() {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-black/70">{label}</label>
      )}

      {value ? (
        <div className={`relative overflow-hidden rounded-xl border border-black/10 bg-white ${variant === "compact" ? "" : ""}`}>
          <img src={value} alt="Preview" className={variant === "compact" ? "h-32 w-full object-cover" : "h-48 w-full object-cover"} />
          <button
            type="button"
            onClick={clearImage}
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-black/70 shadow-lg hover:bg-white"
            title="Supprimer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`flex-1 rounded-xl border-2 border-dashed border-black/15 bg-white text-center hover:border-black/25 hover:bg-black/[0.02] disabled:opacity-50 ${variant === "compact" ? "py-4" : "py-8"}`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black/70"></div>
                  <span className="text-sm text-black/60">Upload...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className={`inline-flex items-center justify-center rounded-full bg-black/5 ${variant === "compact" ? "h-10 w-10" : "h-12 w-12"}`}>
                    <Upload className={variant === "compact" ? "h-5 w-5 text-black/50" : "h-6 w-6 text-black/50"} />
                  </div>
                  <div className={variant === "compact" ? "text-xs font-medium text-black/70" : "text-sm font-medium text-black/70"}>
                    {variant === "compact" ? "Uploader" : "Cliquez pour uploader une image"}
                  </div>
                  {variant === "default" && <div className="text-xs text-black/50">PNG, JPG, WEBP, AVIF jusqu'à 10 Mo</div>}
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {variant === "default" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <button
                    type="button"
                    onClick={() => setUseUrl(!useUrl)}
                    className="bg-white px-2 text-black/50 hover:text-black/70"
                  >
                    {useUrl ? "Masquer" : "Ou utiliser une URL"}
                  </button>
                </div>
              </div>

              {useUrl && (
                <AdminInput
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder || "https://example.com/image.jpg"}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
