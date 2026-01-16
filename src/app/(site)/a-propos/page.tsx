import { Metadata } from "next"
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos — Study Case | Agence d'architecture",
  description: "Découvrez l'histoire de Study Case, agence d'architecture créée par Jean Van Oost et Laurent Jannet. Une équipe de 10 personnes implantée à La Réunion, Mayotte et Bourgogne.",
  openGraph: {
    title: "À propos — Study Case",
    description: "Découvrez l'histoire de Study Case, agence d'architecture créée par Jean Van Oost et Laurent Jannet.",
    type: "website",
  },
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const TEAM = [
  { name: "Jean VAN OOST", role: "architecte DPLG" },
  { name: "Laurent JANNET", role: "architecte DPLG" },
  { name: "Pascale MKADARA", role: "architecte DE" },
  { name: "Aurélie RIBOD", role: "architecte DE" },
  { name: "Gauthier PALLARUELO", role: "architecte DE" },
];

const STAFF = [
  "AHAMADA Maoulida, projeteur et collaborateur architecte",
  "Matthieu HOARAU, pilote de chantier et collaborateur MOE",
  "Julian SENE, collaborateur architecte",
  "Sandrine JUILLEROT, assistante de direction",
  "Soihabati MOUSSA ALI, assistante de direction",
];

const COLLABS = [
  "Halima BOURAHIM",
  "Karen LE BRIS",
  "Gérard BALLION",
  "Marianne DOUA",
  "Stéphane AIME",
  "Frédérique IVANES",
  "Naïma PERON",
  "Raphaël DAROUECHE",
  "Florent LEROY",
  "Yan VERDIER",
  "Zakiya ATTOUMANI",
  "Said ABDI",
  "FayadIWI SAINDOU M’SOILI",
  "Alessancha ZAMARCHI",
  "Oumie MDALLAH",
  "Cécile RACLE",
  "Stéphane CUCHER",
  "Douhouchina EL-ALBASSE",
  "Aurélie MAMMONIER",
  "Faly ANDRIAMBELOSA RAMBOAT",
  "Fatima SIDI",
  "Babaye MADI HATIBOU",
  "Aurore BERTRAND",
  "Philippe BAYARD",
  "Houmadi NOUZOUHA",
  "Canopée MADI-SOUF ONYANANTA",
  "Audrey BECCARIA",
  "Murielle ATEC-TAM",
  "Nunzia DIMOLFETTA",
  "Amal MAIZI",
  "Emilie MALET",
  "Houzali MDALLAH",
  "Victor SEGUELA",
  "Marine CRON",
  "Maïmouma DIOMBERA",
  "Elsa Sarah FREGISSE",
];

const LOCATIONS = [
  {
    city: "SAINT-DENIS",
    lines: [
      "11 rue Roland Garros (97400)",
      "0262 30 26 40",
      "contact@studycase.fr",
    ],
  },
  {
    city: "MAMOUDZOU",
    lines: ["Trévani-BP1306 (97600)", "0269 61 42 15", "jvo@studycase.fr"],
  },
  {
    city: "LOUHANS",
    lines: [
      "10 place de Libération (71500)",
      "03 85 60 00 06",
      "lj@studycase.fr",
    ],
  },
];

function Stripes({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "pointer-events-none absolute inset-0 opacity-[0.22]",
        className
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 2px, transparent 2px, transparent 8px)",
      }}
    />
  );
}

export default function AboutPage() {
  return (
    <main className=" bg-white text-black">
      <div className="w-full px-4 py-10 sm:px-6 lg:px-10 lg:py-14">

        <header className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="mt-3 text-[42px] font-light leading-[0.95] tracking-tight sm:text-[52px]">
                Présentation de l’agence
              </h1>
            </div>
          </div>

          <div className="mt-8 h-[1px] w-full bg-black/10" />
        </header>

        <section className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">

          <div className="lg:col-span-7">
            <div className="relative overflow-hidden border border-black/10 bg-white">
              <Stripes />
              <div className="relative">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/about/agency.jpg"
                    alt="Study Case — agence d’architecture"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover grayscale"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>


          <div className="lg:col-span-5">
            <div className="space-y-6">
              <h2 className="text-[18px] font-medium tracking-tight text-black/85">
                Study Case évoque la continuité.
              </h2>

              <div className="space-y-4 text-[14px] leading-relaxed text-black/60">
                <p>
                  À l’origine, Jean et Laurent sont étudiants en Architecture,
                  ils forgent leurs armes d’entrepreneurs en co-dirigeant avec
                  succès Archipel, la junior entreprise de l’Ecole
                  d’Architecture de Lille et des Régions Nord.
                </p>

                <p>
                  Leurs parcours, diplômes d’Architectes en poche, seront
                  ensuite simultanément parallèles et conjoints. Pendant près de
                  20 ans, les entités JVO architecture et ARCAD 26 architecture
                  ; formées respectivement par Jean Van Oost à Mayotte, et
                  Laurent Jannet en Bourgogne, ont croisé fraternellement leurs
                  expériences.
                </p>

                <p>
                  Longtemps a germé l’idée d’une fusion des identités, à chaque
                  rencontre, à chaque concours réalisé. Plus qu’une fusion, se
                  décidera une création, celle de Study Case.
                </p>

                <p>
                  Study Case évoque la continuité, la continuité comme
                  thématique appropriée du « Case Study House Program »,
                  l’élément référent de notre démarche.
                </p>

                <p>
                  Aujourd’hui, Study Case se matérialise par 3 agences
                  implantées à la Réunion, à Mayotte et en Bourgogne et dispose
                  d’une équipe de 10 personnes.
                </p>
              </div>

              <div className="mt-6 border-l border-black/10 pl-5">
                <p className="text-[12px] uppercase tracking-[0.22em] text-black/45">
                  Implantations
                </p>
                <p className="mt-2 text-[14px] text-black/60">
                  La Réunion · Mayotte · Bourgogne
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                Équipe
              </p>
              <h3 className="mt-2 text-[22px] font-light tracking-tight">
                Direction & architectes
              </h3>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((m) => (
              <div
                key={m.name}
                className="rounded-none border border-black/10 bg-white p-5 transition hover:bg-black/[0.02]"
              >
                <div className="h-[2px] w-10 bg-black/70" />
                <div className="mt-3 text-[14px] font-medium text-black/80">
                  {m.name}
                </div>
                <div className="mt-1 text-[12px] uppercase tracking-[0.2em] text-black/45">
                  {m.role}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-none border border-black/10 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-10 bg-black/70" />
              <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                Collaborateurs
              </p>
            </div>

            <ul className="mt-4 grid grid-cols-1 gap-2 text-[13px] text-black/60 sm:grid-cols-2 lg:grid-cols-3">
              {STAFF.map((s) => (
                <li key={s} className="leading-relaxed">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>


        <section className="mx-auto mt-14 max-w-6xl">
          <div className="relative overflow-hidden border border-black/10 bg-white">
            <Stripes />
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-10 bg-black/70" />
                <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                  Ont également collaboré
                </p>
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-black/55">
                {COLLABS.join(" · ")}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">
                Contacts
              </p>
              <h3 className="mt-2 text-[22px] font-light tracking-tight">
                Nos agences
              </h3>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
            {LOCATIONS.map((l) => (
              <div key={l.city} className="border border-black/10 bg-white p-6">
                <div className="text-[12px] font-medium tracking-tight text-black/85">
                  {l.city}
                </div>
                <div className="mt-3 space-y-1 text-[13px] text-black/60">
                  {l.lines.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center">
            <Link
              href="/contact"
              className="rounded-none border border-black bg-black px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-black/90"
            >
              Nous Contacter
            </Link>
          </div>

          <div className="mt-14 h-[1px] w-full bg-black/10" />
          <p className="mt-6 text-center text-[10px] uppercase tracking-[0.22em] text-black/35">
            © {new Date().getFullYear()} Study Case
          </p>
        </section>
      </div>
    </main>
  );
}
