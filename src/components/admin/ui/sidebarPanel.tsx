"use client"

import { useState, ReactNode } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface SidebarPanelProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function SidebarPanel({ title, children, defaultOpen = true }: SidebarPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="rounded-lg border border-black/10 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-black/[0.02]"
      >
        <h3 className="text-sm font-semibold text-black">{title}</h3>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && <div className="border-t border-black/5 p-4">{children}</div>}
    </div>
  )
}
