"use client"

import { useState } from "react"
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  Image,
  Quote,
  Heading2,
  Heading3,
  List,
  ListOrdered,
} from "lucide-react"
import AdminInput from "@/components/admin/ui/input"
import AdminTextarea from "@/components/admin/ui/textarea"
import ImageUpload from "@/components/admin/ImageUpload"

interface Block {
  type: "paragraph" | "image" | "quote" | "heading2" | "heading3" | "list" | "ordered-list"
  text?: string
  src?: string
  alt?: string
  caption?: string
  items?: string[]
}

interface BlockEditorProps {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
  articleSlug?: string
}

export default function BlockEditor({ blocks, onChange, articleSlug }: BlockEditorProps) {
  const [showMenu, setShowMenu] = useState(false)

  function addBlock(type: Block["type"]) {
    const newBlock: Block = { type }
    if (
      type === "paragraph" ||
      type === "quote" ||
      type === "heading2" ||
      type === "heading3"
    ) {
      newBlock.text = ""
    } else if (type === "image") {
      newBlock.src = ""
      newBlock.alt = ""
      newBlock.caption = ""
    } else if (type === "list" || type === "ordered-list") {
      newBlock.items = [""]
    }
    onChange([...blocks, newBlock])
    setShowMenu(false)
  }

  function updateBlock(index: number, updates: Partial<Block>) {
    const updated = [...blocks]
    updated[index] = { ...updated[index], ...updates }
    onChange(updated)
  }

  function removeBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index))
  }

  function moveBlock(index: number, direction: "up" | "down") {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === blocks.length - 1)
    )
      return

    const updated = [...blocks]
    const newIndex = direction === "up" ? index - 1 : index + 1
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    onChange(updated)
  }

  function addListItem(index: number) {
    const block = blocks[index]
    if (block.type === "list" || block.type === "ordered-list") {
      updateBlock(index, { items: [...(block.items || []), ""] })
    }
  }

  function updateListItem(blockIndex: number, itemIndex: number, value: string) {
    const block = blocks[blockIndex]
    if (block.type === "list" || block.type === "ordered-list") {
      const items = [...(block.items || [])]
      items[itemIndex] = value
      updateBlock(blockIndex, { items })
    }
  }

  function removeListItem(blockIndex: number, itemIndex: number) {
    const block = blocks[blockIndex]
    if (block.type === "list" || block.type === "ordered-list") {
      const items = (block.items || []).filter((_, i) => i !== itemIndex)
      updateBlock(blockIndex, { items })
    }
  }

  const blockIcons = {
    paragraph: Type,
    image: Image,
    quote: Quote,
    heading2: Heading2,
    heading3: Heading3,
    list: List,
    "ordered-list": ListOrdered,
  }

  const blockLabels = {
    paragraph: "Paragraphe",
    image: "Image",
    quote: "Citation",
    heading2: "Titre H2",
    heading3: "Titre H3",
    list: "Liste à puces",
    "ordered-list": "Liste numérotée",
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const Icon = blockIcons[block.type]
        return (
          <div key={index} className="relative rounded-xl border border-black/10 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-black/50" />
                <span className="text-xs font-medium uppercase tracking-wider text-black/50">
                  {blockLabels[block.type]}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveBlock(index, "up")}
                  disabled={index === 0}
                  className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-black/5 disabled:opacity-30"
                  title="Déplacer vers le haut"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(index, "down")}
                  disabled={index === blocks.length - 1}
                  className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-black/5 disabled:opacity-30"
                  title="Déplacer vers le bas"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded text-red-600 hover:bg-red-50"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {block.type === "paragraph" && (
              <AdminTextarea
                value={block.text || ""}
                onChange={(e) => updateBlock(index, { text: e.target.value })}
                placeholder="Écrivez votre paragraphe..."
                rows={4}
              />
            )}

            {block.type === "heading2" && (
              <AdminInput
                value={block.text || ""}
                onChange={(e) => updateBlock(index, { text: e.target.value })}
                placeholder="Titre de section (H2)"
                className="text-lg font-semibold"
              />
            )}

            {block.type === "heading3" && (
              <AdminInput
                value={block.text || ""}
                onChange={(e) => updateBlock(index, { text: e.target.value })}
                placeholder="Sous-titre (H3)"
                className="text-base font-semibold"
              />
            )}

            {block.type === "quote" && (
              <AdminTextarea
                value={block.text || ""}
                onChange={(e) => updateBlock(index, { text: e.target.value })}
                placeholder="Citation..."
                rows={3}
              />
            )}

            {block.type === "image" && (
              <div className="space-y-3">
                <ImageUpload
                  value={block.src || ""}
                  onChange={(url) => updateBlock(index, { src: url })}
                  folder={articleSlug || "general"}
                  type="articles"
                  placeholder="URL de l'image"
                />
                <AdminInput
                  value={block.alt || ""}
                  onChange={(e) => updateBlock(index, { alt: e.target.value })}
                  placeholder="Texte alternatif"
                />
                <AdminInput
                  value={block.caption || ""}
                  onChange={(e) => updateBlock(index, { caption: e.target.value })}
                  placeholder="Légende (optionnel)"
                />
              </div>
            )}

            {(block.type === "list" || block.type === "ordered-list") && (
              <div className="space-y-2">
                {(block.items || []).map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2">
                    <AdminInput
                      value={item}
                      onChange={(e) => updateListItem(index, itemIndex, e.target.value)}
                      placeholder={`Élément ${itemIndex + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem(index, itemIndex)}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem(index)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-black/15 bg-white py-2 text-sm text-black/60 hover:bg-black/[0.02]"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un élément
                </button>
              </div>
            )}
          </div>
        )
      })}

      <div className="relative">
        {showMenu && (
          <div className="absolute bottom-full left-0 mb-2 grid w-full grid-cols-2 gap-2 rounded-xl border border-black/10 bg-white p-2 shadow-lg">
            <button
              type="button"
              onClick={() => addBlock("heading2")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-black/5"
            >
              <Heading2 className="h-5 w-5 text-black/50" />
              <div>
                <div className="text-sm font-medium">Titre H2</div>
                <div className="text-xs text-black/50">Titre de section</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => addBlock("heading3")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-black/5"
            >
              <Heading3 className="h-5 w-5 text-black/50" />
              <div>
                <div className="text-sm font-medium">Titre H3</div>
                <div className="text-xs text-black/50">Sous-titre</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => addBlock("paragraph")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-black/5"
            >
              <Type className="h-5 w-5 text-black/50" />
              <div>
                <div className="text-sm font-medium">Paragraphe</div>
                <div className="text-xs text-black/50">Bloc de texte</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => addBlock("list")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-black/5"
            >
              <List className="h-5 w-5 text-black/50" />
              <div>
                <div className="text-sm font-medium">Liste</div>
                <div className="text-xs text-black/50">Liste à puces</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => addBlock("ordered-list")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-black/5"
            >
              <ListOrdered className="h-5 w-5 text-black/50" />
              <div>
                <div className="text-sm font-medium">Liste numérotée</div>
                <div className="text-xs text-black/50">Liste ordonnée</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => addBlock("image")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-black/5"
            >
              <Image className="h-5 w-5 text-black/50" />
              <div>
                <div className="text-sm font-medium">Image</div>
                <div className="text-xs text-black/50">Ajouter une image</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => addBlock("quote")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-black/5"
            >
              <Quote className="h-5 w-5 text-black/50" />
              <div>
                <div className="text-sm font-medium">Citation</div>
                <div className="text-xs text-black/50">Bloc de citation</div>
              </div>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/15 bg-white py-4 text-sm font-medium text-black/60 hover:border-black/25 hover:bg-black/[0.02]"
        >
          <Plus className="h-5 w-5" />
          Ajouter un bloc
        </button>
      </div>
    </div>
  )
}
