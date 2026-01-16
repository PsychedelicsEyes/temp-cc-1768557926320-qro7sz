import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Mentions légales — Study Case | Agence d'architecture",
  description: "Mentions légales et conditions d'utilisation du site Study Case. Informations sur la protection des données personnelles et la propriété intellectuelle.",
  openGraph: {
    title: "Mentions légales — Study Case",
    description: "Mentions légales et conditions d'utilisation du site Study Case.",
    type: "website",
  },
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function Section({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cx("mt-10", className)}>
      <h2 className="text-base font-medium tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-black/70">
        {children}
      </div>
    </section>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-black/70">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen w-full bg-white text-black">
      <section className="mx-auto w-full max-w-[900px] px-4 py-10 sm:px-6 lg:px-10">
        <header className="mb-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/40">
            Informations légales
          </p>

          <h1 className="mt-3 text-[38px] font-light leading-[1.05] tracking-tight sm:text-[52px]">
            Mentions légales
          </h1>

          <p className="mt-5 max-w-[70ch] text-sm leading-7 text-black/60">
            Nous vous remercions de votre visite sur{" "}
            <span className="text-black/75">www.studycase.fr</span>. En visitant ce
            site, vous acceptez les pratiques décrites ci-dessous et adhérez aux
            termes et conditions énoncés.
          </p>

          <div className="mt-8 h-px w-full bg-black/10" />
        </header>
        <p className="text-sm leading-7 text-black/70">
          Le site <span className="text-black/80">www.studycase.fr</span> est
          destiné à l’information personnelle des internautes qui l’utilisent.
        </p>

        <Section title="Informations générales">
          <p>
            Ce site est propriété de <span className="text-black/80">STUDY CASE</span>.
          </p>
          <p>
            Siège social : <span className="text-black/80">STUDY CASE</span> — 61 rue
            Bertin, 97400 Saint-Denis
          </p>
          <p>
            Ce site a été créé par :{" "}
            <span className="text-black/80">NetinUp Saône-et-Loire</span>
          </p>
          <p className="text-black/60">
            (Référence :{" "}
            <Link
              href="https://www.netinup-saoneetloire.fr"
              className="underline decoration-black/15 underline-offset-4 hover:decoration-black/30"
            >
              www.netinup-saoneetloire.fr
            </Link>
            )
          </p>
          <p>
            Ce site est maintenu par :{" "}
            <span className="text-black/80">NetinUp Saône-et-Loire</span>
          </p>
          <p>
            Ce site est hébergé par :{" "}
            <span className="text-black/80">
              NetinUp Réseau, 20 bd Eugène Deruelle, 69003 Lyon
            </span>
          </p>
          <p>
            Contact : <span className="text-black/80">01 88 32 18 31</span>
          </p>
        </Section>

        <Section title="Copyright">
          <p>
            <span className="text-black/80">STUDY CASE</span>
          </p>
        </Section>

        <Section title="Droit applicable">
          <p>
            Le site Internet <span className="text-black/80">www.studycase.fr</span>{" "}
            et les présentes conditions générales sont soumises au droit français et
            sont rédigées en français.
          </p>
          <p>
            <span className="text-black/80">STUDY CASE</span> se réserve le droit de
            modifier les présentes mentions à tout moment. L’utilisateur s’engage à
            les consulter régulièrement.
          </p>
        </Section>

        <Section title="Protection des données personnelles">
          <p>
            La consultation du site{" "}
            <span className="text-black/80">www.studycase.fr</span> est possible sans
            que vous ayez à révéler votre identité ou toute autre information à
            caractère personnel vous concernant.
          </p>
          <p>
            La société <span className="text-black/80">STUDY CASE</span> s’engage à
            respecter votre vie privée et à protéger les informations que vous lui
            communiquez. En particulier, les données personnelles collectées sur le
            site Internet <span className="text-black/80">www.studycase.fr</span> sont
            destinées à l’usage de <span className="text-black/80">STUDY CASE</span>.
            Elles sont confidentielles et traitées comme telles.
          </p>
          <p>
            Concernant les informations à caractère nominatif que vous seriez amenés
            à nous communiquer, vous bénéficiez d’un droit d’accès et de rectification
            conformément à la loi française Informatique et Libertés n° 78-17 du 6
            janvier 1978. Vous pouvez exercer ce droit auprès de{" "}
            <span className="text-black/80">STUDY CASE</span> — Adresse : 61 rue Bertin,
            97400 Saint-Denis.
          </p>
          <p>
            Si vous êtes abonnés à des services d’information par courrier électronique
            (« newsletter »), vous pouvez demander à ne plus recevoir ces courriers.
          </p>
          <p>
            Afin de vous proposer des produits et services toujours plus adaptés,
            certaines informations à caractère non personnel, relatives à votre
            activité sur ce site, peuvent être automatiquement collectées. Ces
            informations sont destinées à <span className="text-black/80">STUDY CASE</span>{" "}
            et pourront également être utilisées dans le cadre d’opérations
            commerciales/marketing ou servir de base à des études et analyses.
          </p>
          <p>
            Ces informations ne seront en aucun cas communiquées à des tiers. Seul le
            personnel de <span className="text-black/80">STUDY CASE</span> a accès aux
            données.
          </p>
        </Section>

        <Section title="Sécurité">
          <p>
            Nous prenons toutes les précautions utiles afin de préserver l’intégrité
            des données, leur confidentialité et empêcher toute communication à des
            tiers non autorisés.
          </p>
        </Section>

        <Section title="Liens hypertextes">
          <p>
            La mise en place d’un lien hypertexte vers le site{" "}
            <span className="text-black/80">www.studycase.fr</span> ne nécessite pas
            d’autorisation préalable et écrite de <span className="text-black/80">STUDY CASE</span>.
            Néanmoins, <span className="text-black/80">STUDY CASE</span> doit en être
            informé dans un délai maximum de 30 jours après la mise en place du lien.
          </p>
          <p>
            En tout état de cause, <span className="text-black/80">STUDY CASE</span>{" "}
            n’est en aucun cas tenue responsable du contenu ainsi que des produits ou
            services proposés sur les sites auxquels le site{" "}
            <span className="text-black/80">www.studycase.fr</span> se trouverait lié
            par des liens hypertextes ou tout autre type de lien.
          </p>
        </Section>

        <Section title="Droits de propriété intellectuelle">
          <p>
            <span className="text-black/80">STUDY CASE</span> avise les utilisateurs
            de ce site que de nombreux éléments de ce site :
          </p>
          <List
            items={[
              "sont protégés par la législation sur le droit d’auteur (photographies, articles, dessins, séquences animées, etc.) ;",
              "et/ou sont protégés par la législation sur les dessins et modèles ;",
              "sont protégés par la législation sur les marques.",
            ]}
          />
          <p>
            Les éléments ainsi protégés sont la propriété de{" "}
            <span className="text-black/80">STUDY CASE</span> ou de tiers ayant
            autorisé <span className="text-black/80">STUDY CASE</span> à les exploiter.
          </p>
          <p>
            Toute reproduction, représentation, utilisation, adaptation, modification,
            incorporation, traduction, commercialisation, partielles ou intégrales,
            par quelque procédé et sur quelque support que ce soit (papier, numérique,
            …) sont interdites, sans l’autorisation écrite préalable de{" "}
            <span className="text-black/80">STUDY CASE</span>, hormis les exceptions
            visées à l’article L 122-5 du Code de la Propriété Intellectuelle, sous
            peine de constituer un délit de contrefaçon (droit d’auteur et/ou dessins
            et modèles et/ou marque), puni de deux ans d’emprisonnement et de 150 000 €
            d’amende.
          </p>
        </Section>

        <Section title="Droits d’auteur et/ou droits sur les dessins et modèles">
          <p>
            Les photographies, textes, slogans, dessins, images, séquences animées
            sonores ou non ainsi que toutes les œuvres intégrées dans le site sont la
            propriété de <span className="text-black/80">STUDY CASE</span> ou de tiers
            ayant autorisé <span className="text-black/80">STUDY CASE</span> à les utiliser.
          </p>
          <p>
            Les reproductions, sur un support papier ou informatique, dudit site sont
            autorisées sous réserve qu’elles soient strictement réservées à un usage
            personnel excluant tout usage à des fins publicitaires et/ou commerciales
            et/ou d’information et/ou qu’elles soient conformes aux dispositions de
            l’article L122-5 du Code de la Propriété Intellectuelle.
          </p>
        </Section>

        <Section title="Informations relatives aux produits">
          <p>
            Dans le cadre d’une politique d’amélioration constante de ses produits et
            services, <span className="text-black/80">STUDY CASE</span> peut modifier à
            tout moment les caractéristiques de son offre. Les produits et/ou services
            présentés sur ce site sont ceux distribués en France métropolitaine.
          </p>
          <p>
            En tout état de cause, les informations contenues sur ce site sont des
            informations à caractère général et n’ont pas valeur contractuelle.
          </p>
        </Section>

        <Section title="Limitation de responsabilité">
          <p>
            Vous utilisez le site <span className="text-black/80">www.studycase.fr</span>{" "}
            sous votre seule et entière responsabilité.{" "}
            <span className="text-black/80">STUDY CASE</span> ne pourra être tenue pour
            responsable des dommages directs ou indirects, tels que, notamment,
            préjudice matériel, pertes de données ou de programme, préjudice financier,
            résultant de l’utilisation de ce site ou de sites qui lui sont liés.
          </p>
        </Section>

        <Section title="Mise à jour">
          <p>
            <span className="text-black/80">STUDY CASE</span> se réserve le droit de
            modifier et de mettre à jour, sans préavis, les présentes mentions légales
            et tous les éléments, produits présentés sur le site. L’ensemble de ces
            modifications s’impose aux internautes qui doivent consulter les présentes
            conditions générales lors de chaque connexion.
          </p>
        </Section>

        <Section title="Données statistiques de suivi">
          <p>
            Nous utilisons les données de connexion pour nos statistiques de
            consultation (type de navigateur, nombre de visiteurs, rubriques visitées…)
            pour l’optimisation de notre site en termes de rubriques et de navigation,
            mais ces informations ne sont pas transmises à des tiers.
          </p>
        </Section>

        <Section title="La reproduction sur support papier">
          <p>
            À l’exception de l’iconographie, la reproduction des pages de ce site sur
            un support papier est autorisée, sous réserve du respect des trois
            conditions suivantes :
          </p>
          <List
            items={[
              "gratuité de la diffusion ;",
              "respect de l’intégrité des documents reproduits (aucune modification, ni altération d’aucune sorte) ;",
              "citation explicite du site www.studycase.fr comme source et mention que les droits de reproduction sont réservés et strictement limités.",
            ]}
          />
        </Section>
        <div className="mt-14 h-px w-full bg-black/10" />
        <p className="mt-6 text-xs leading-6 text-black/45">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </p>
      </section>
    </main>
  )
}
