"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Property } from "@/lib/properties.data"

export default function PropertyCard({ item, index }: { item: Property; index: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), index * 30)
    return () => clearTimeout(t)
  }, [index])

  return (
    <Link
      href={`/propriete/${item.slug}`}
      className={`group relative block overflow-hidden transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="relative h-[250px] w-full overflow-hidden bg-neutral-100">
        <Image
          src={item.hero.src}
          alt={item.hero.alt ?? item.title}
          fill
          className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
          sizes="(max-width: 640px) 100vw, 33vw"
          priority={index < 8}
        />

        <div className="absolute inset-0 bg-black/0 transition-opacity duration-500 group-hover:bg-black/5" />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <h3 className="mb-0.5 text-[12px] font-medium leading-tight text-white">
            {item.title}
          </h3>
          <p className="text-[10px] text-white/70">{item.location}</p>
        </div>
      </div>
    </Link>
  )
}