"use client"

import { useMemo } from "react"
import PropertyCard from "./PropertyCard"
import type { Property } from "@/lib/properties.data"

export default function PropertyGrid({ properties }: { properties: Property[] }) {
  const rowStructure = useMemo(() => {
    return [
      { count: 4, offset: 0, widths: [0.9, 1.2, 1.1, 0.8] },
      { count: 4, offset: 70, widths: [1.3, 1.1, 0.8, 1] },
      { count: 4, offset: 140, widths: [0.8, 0.9, 1.4, 0.9] },
      { count: 4, offset: 70, widths: [0.9, 1, 1.2, 1.1] },
      { count: 4, offset: 0, widths: [1.1, 0.9, 1.3, 0.9] },
      { count: 4, offset: 70, widths: [1, 1.2, 0.8, 1.1] },
    ]
  }, [])

  const rows = useMemo(() => {
    const out: { properties: Property[]; offset: number; widths: number[] }[] = []
    let currentIndex = 0

    rowStructure.forEach(({ count, offset, widths }) => {
      const rowProperties = properties.slice(currentIndex, currentIndex + count)
      if (rowProperties.length > 0) {
        out.push({ properties: rowProperties, offset, widths })
        currentIndex += count
      }
    })

    while (currentIndex < properties.length) {
      const patternIndex = out.length % rowStructure.length
      const pattern = rowStructure[patternIndex]
      const rowProperties = properties.slice(currentIndex, currentIndex + pattern.count)

      if (rowProperties.length > 0) {
        out.push({
          properties: rowProperties,
          offset: pattern.offset,
          widths: pattern.widths,
        })
        currentIndex += pattern.count
      } else {
        break
      }
    }

    return out
  }, [properties, rowStructure])

  return (
    <div className="w-full p-4 lg:p-6 overflow-x-hidden">
      {/* Mobile / tablette */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 lg:hidden">
        {properties.map((item, index) => (
          <PropertyCard key={item.slug} item={item} index={index} />
        ))}
      </div>

      {/* Desktop : ✅ bord droit aligné, la ligne “part” vers la gauche */}
      <div className="hidden lg:block">
        <div className="space-y-1">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="w-full">
              <div
                className="ml-auto flex gap-1"
                style={{
                  // ✅ plus offset est grand => plus la ligne est “courte” => vide à gauche
                  width: `calc(100% - ${row.offset}px)`,
                  maxWidth: "100%",
                }}
              >
                {row.properties.map((item, colIndex) => (
                  <div
                    key={item.slug}
                    style={{
                      flex: `${row.widths[colIndex] || 1} 1 0%`,
                      minWidth: 0,
                    }}
                  >
                    <PropertyCard item={item} index={rowIndex * 4 + colIndex} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
