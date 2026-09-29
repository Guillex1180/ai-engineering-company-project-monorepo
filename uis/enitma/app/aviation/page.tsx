import type { Metadata } from "next";
import Link from "next/link";
import DataFlow from "@/components/DataFlow";
import IntelligenceGraph from "@/components/IntelligenceGraph";
import PageHeader from "@/components/PageHeader";
import { AVIATION_NODES } from "@/lib/graph-data";

export const metadata: Metadata = {
  title: "Aviation Intelligence — enITma",
  description:
    "enITma combina experiencia en aviación, datos, automatización e IA para optimizar finanzas, operaciones y la experiencia del pasajero."
};

const PILLARS = [
  ["Aviation expertise", "Conocimiento profundo del negocio aéreo."],
  ["Data", "Ingeniería de datos sobre grandes volúmenes."],
  ["Automation", "Automatización de procesos operativos."],
  ["AI", "Modelos aplicados a decisiones reales."],
  ["Predictive Intelligence", "Anticipación de eventos operativos y de negocio."]
];

export default function AviationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Aviation"
        title="Aviation Intelligence"
        description="Combinamos experiencia en aviación, datos, automatización e inteligencia artificial para transformar la toma de decisiones."
      />

      <section className="container-enitma pt-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PILLARS.map(([title, desc]) => (
            <div key={title} className="card">
              <p className="t-h3 text-base">{title}</p>
              <p className="mt-1 t-caption">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-enitma section">
        <h2 className="t-h2">enITma Aviation Intelligence</h2>
        <p className="mt-3 t-small prose-width">
          Selecciona un nodo para ver descripción, tecnologías, aplicaciones y beneficios.
        </p>
        <div className="mt-10">
          <IntelligenceGraph centerLabel="enITma Aviation Intelligence" nodes={AVIATION_NODES} />
        </div>
        <div className="mt-12">
          <DataFlow
            label="Financial Intelligence"
            steps={["TRANSACTION", "DOCUMENT", "EXTRACTION", "VALIDATION", "RECONCILIATION", "ANOMALY", "INTELLIGENCE", "ACTION"]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href="/soluciones" className="btn-primary">Ver soluciones</Link>
          <Link href="/space" className="btn-ghost">Explorar Space</Link>
        </div>
      </section>
    </>
  );
}
