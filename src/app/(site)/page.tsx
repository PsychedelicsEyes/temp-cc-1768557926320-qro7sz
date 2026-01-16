import { Metadata } from "next"
import Sidebar from "@/components/layout/sidebar"
import PropertyGrid from "@/components/property/PropertyGrid"
import { getProperties } from "@/lib/properties.server"

export const metadata: Metadata = {
  title: "Study Case — Agence d'architecture | La Réunion, Mayotte, Bourgogne",
  description: "Study Case est une agence d'architecture implantée à La Réunion, Mayotte et en Bourgogne. Découvrez nos projets de logements, équipements publics et aménagements urbains.",
  openGraph: {
    title: "Study Case — Agence d'architecture",
    description: "Agence d'architecture implantée à La Réunion, Mayotte et en Bourgogne. Projets de logements, équipements publics et aménagements urbains.",
    type: "website",
  },
}

export default async function Page() {
  const properties = await getProperties()

  return (
    <main className="min-h-screen bg-white text-black w-full">
      <div className="lg:pl-80">
        <PropertyGrid properties={properties} />
      </div>
    </main>
  )
}
