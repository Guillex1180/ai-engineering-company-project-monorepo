import type { Metadata } from "next";
import Link from "next/link";
import DataFlow from "@/components/DataFlow";
import IntelligenceGraph from "@/components/IntelligenceGraph";
import PageHeader from "@/components/PageHeader";
import { SPACE_NODES } from "@/lib/graph-data";

export const metadata: Metadata = {
  title: "Space Technology — enITma",
  description:
    "Explorando cómo las capacidades de datos, IA y automatización de enITma podrían aplicarse a la industria espacial. Aplicaciones potenciales."
};

export default function SpacePage() {
  return (
    <>
      <PageHeader
        eyebrow="Space"
        title="Intelligence beyond aviation."
        description="Explorando cómo las capacidades de datos, inteligencia artificial y automatización de enITma pueden aplicarse a la industria espacial."
      />

      <section className="container-enitma pt-8">
        <div className="max-w-3xl rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 text-sm text-sky-200">
          <strong>Aplicaciones potenciales.</strong> enITma no afirma trabajar actualmente con
          agencias espaciales, fabricantes de satélites ni misiones. Esta sección presenta cómo
          las capacidades existentes de enITma <em>podrían</em> adaptarse a la industria espacial.
        </div>
      </section>

      <section className="container-enitma section">
        <h2 className="t-h2">enITma Space Intelligence</h2>
        <p className="mt-3 t-small prose-width">
          Explora las posibles adaptaciones. Todos los nodos representan aplicaciones potenciales.
        </p>
        <div className="mt-10">
          <IntelligenceGraph centerLabel="enITma Space Intelligence" nodes={SPACE_NODES} />
        </div>
        <div className="mt-12">
          <DataFlow
            label="Flujo de inteligencia espacial (potencial)"
            steps={["SATELLITE", "TELEMETRY", "DATA PLATFORM", "AI", "ANOMALY", "PREDICTION", "DECISION"]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href="/aviation" className="btn-primary">Ver Aviation</Link>
          <Link href="/contacto" className="btn-ghost">Hablar con enITma</Link>
        </div>
      </section>
    </>
  );
}
