import Link from "next/link";
import DataFlow from "@/components/DataFlow";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div aria-hidden="true" className="starfield absolute inset-0 opacity-40" />
        <div aria-hidden="true" className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-32 top-24 h-80 w-80 rounded-full bg-signal-500/10 blur-3xl" />
        <div className="container-enitma relative py-24 lg:py-32">
          <span className="eyebrow">Technology · Intelligence · Aviation · Space</span>
          <h1 className="t-display max-w-4xl">
            Intelligence that moves industries forward.
          </h1>
          <p className="mt-6 t-body-lg prose-width">
            Transformamos datos, operaciones y procesos complejos en inteligencia para tomar
            mejores decisiones.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/soluciones" className="btn-primary">Explorar soluciones</Link>
            <Link href="/aviation" className="btn-ghost">Conocer enITma</Link>
          </div>
          <div className="mt-14">
            <DataFlow
              label="El flujo de valor de enITma"
              steps={["DATA", "INTELLIGENCE", "PREDICTION", "DECISION", "ACTION"]}
            />
          </div>
        </div>
      </section>

      {/* SOLUCIONES — dos grandes cards Aviation / Space */}
      <section id="soluciones" className="container-enitma section">
        <span className="eyebrow">Soluciones</span>
        <h2 className="t-h2 max-w-3xl">Tecnología diseñada para industrias complejas</h2>
        <p className="mt-3 t-small prose-width">
          Convertimos datos en decisiones. Elige un dominio para explorar cómo lo hacemos.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* AVIATION */}
          <article className="card card-hover flex flex-col">
            <span className="badge badge-info w-fit">Aviation Intelligence</span>
            <h3 className="mt-4 text-2xl font-bold text-white">Aviation</h3>
            <p className="mt-2 t-small flex-1">
              Combinamos experiencia en aviación, datos, automatización e IA para optimizar
              finanzas, operaciones y la experiencia del pasajero.
            </p>
            <Link href="/aviation" className="btn-secondary mt-6 w-fit px-4 py-2">
              Explorar Aviation
            </Link>
          </article>

          {/* SPACE */}
          <article className="card card-hover flex flex-col">
            <span className="badge badge-neutral w-fit">Space Technology · potencial</span>
            <h3 className="mt-4 text-2xl font-bold text-white">Space</h3>
            <p className="mt-2 t-small flex-1">
              Exploramos cómo las capacidades tecnológicas de enITma pueden adaptarse a los
              desafíos de la industria espacial.
            </p>
            <Link href="/space" className="btn-secondary mt-6 w-fit px-4 py-2">
              Explorar Space
            </Link>
          </article>
        </div>
      </section>

      {/* CTA de cierre */}
      <section className="border-t border-white/10 bg-space-900/50">
        <div className="container-enitma section text-center">
          <h2 className="t-h2">Convierte tus datos en decisiones</h2>
          <p className="mx-auto mt-3 t-small prose-width">
            Cuéntanos sobre tu organización y te mostramos cómo enITma puede ayudarte.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contacto" className="btn-primary">Hablar con enITma</Link>
            <Link href="/soluciones" className="btn-ghost">Ver soluciones</Link>
          </div>
        </div>
      </section>
    </>
  );
}
