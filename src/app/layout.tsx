import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Session from "@/providers/session"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.studycase.fr"),
  title: {
    default: "Study Case — Agence d'architecture",
    template: "%s | Study Case",
  },
  description: "Study Case est une agence d'architecture implantée à La Réunion, Mayotte et en Bourgogne. Découvrez nos projets de logements, équipements publics et aménagements urbains.",
  keywords: ["architecture", "La Réunion", "Mayotte", "Bourgogne", "logements", "équipements publics", "aménagement urbain"],
  authors: [{ name: "Study Case" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Study Case",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white text-black antialiased`}>
        <Session>{children}</Session>
      </body>
    </html>
  )
}
