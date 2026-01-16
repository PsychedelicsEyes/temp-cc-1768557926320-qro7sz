import { Metadata } from "next"
import ContactForm from "@/components/contact/ContactForm"

export const metadata: Metadata = {
  title: "Contact — Study Case | Agence d'architecture",
  description: "Contactez Study Case pour vos projets d'architecture à La Réunion, Mayotte ou en Bourgogne. Téléphone : 0262 30 26 40 — Email : lj@studycase.fr",
  openGraph: {
    title: "Contact — Study Case",
    description: "Contactez Study Case pour vos projets d'architecture à La Réunion, Mayotte ou en Bourgogne.",
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-[100dvh] bg-white text-black">
      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
        <header className="mb-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/40">
            Contact
          </p>
          <h1 className="mt-3 text-[42px] font-light leading-[1] tracking-tight sm:text-[56px]">
            Contactez-nous
          </h1>
          <div className="mt-4 h-[2px] w-12 bg-black/70" />
          <p className="mt-5 max-w-[64ch] text-[14px] leading-relaxed text-black/55">
            Remplissez le formulaire ci-dessous pour nous contacter. Nous vous répondrons
            dans les meilleurs délais.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="border border-black/10 bg-white p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="border border-black/10 bg-white p-6 sm:p-8 lg:sticky lg:top-10">
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
                  Study Case
                </p>
                <h2 className="mt-2 text-[22px] font-light tracking-tight">
                  Coordonnées
                </h2>
                <div className="mt-4 h-[1px] w-full bg-black/10" />
              </div>

              <div className="space-y-4 text-[14px] text-black/70">
                <div>
                  <p className="text-black/45">Adresse</p>
                  <p className="mt-1 leading-relaxed">
                    61 rue Bertin
                    <br />
                    97400 Saint-Denis
                  </p>
                </div>

                <div>
                  <p className="text-black/45">Téléphone</p>
                  <a
                    href="tel:+262262302640"
                    className="mt-1 inline-block font-medium text-black/80 hover:text-black"
                  >
                    0262 30 26 40
                  </a>
                </div>

                <div>
                  <p className="text-black/45">Email</p>
                  <a
                    href="mailto:lj@studycase.fr"
                    className="mt-1 inline-block font-medium text-black/80 hover:text-black"
                  >
                    lj@studycase.fr
                  </a>
                </div>
              </div>

              <div className="mt-8 border-t border-black/10 pt-6">
                <p className="text-[12px] leading-relaxed text-black/50">
                  * Champs obligatoires. Vos données sont uniquement utilisées pour répondre
                  à votre demande.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
