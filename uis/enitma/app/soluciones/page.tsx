import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Soluciones — enITma",
  description:
    "Las tecnologías de enITma organizadas por categoría: Financial, Operational, Passenger, Predictive y Data & AI."
};

interface Category {
  id: string;
  name: string;
  problem: string;
  solution: string;
  technology: string;
  benefit: string;
  products: string[];
}

const CATEGORIES: Category[] = [
  {
    id: "financial",
    name: "Financial Intelligence",
    problem: "Grandes volúmenes de transacciones difíciles de auditar y expuestas a fraude.",
    solution: "Detección de anomalías, prevención de fraude y optimización de ingresos con IA.",
    technology: "Anomaly Detection · Machine Learning · Data Engineering.",
    benefit: "Mayor control, transparencia y reducción de riesgo.",
    products: ["enITma Financial Trust AI"]
  },
  {
    id: "operational",
    name: "Operational Intelligence",
    problem: "Decisiones operativas complejas que requieren respuesta en tiempo real.",
    solution: "Analítica e inteligencia de decisión aplicadas a la eficiencia operativa.",
    technology: "Predictive Analytics · Decision Intelligence · Automation.",
    benefit: "Decisiones más rápidas y operación más eficiente.",
    products: ["Predictive Intelligence Platform AI", "Security Airport & Shift Compliance"]
  },
  {
    id: "passenger",
    name: "Passenger Intelligence",
    problem: "Entender el comportamiento del viaje del pasajero a gran escala.",
    solution: "Inteligencia de grafo sobre el comportamiento y las relaciones del viaje.",
    technology: "Graph Intelligence · Machine Learning.",
    benefit: "Personalización e insights de comportamiento.",
    products: ["enITma Travel Behavior Graph AI", "Airline Travel Intelligence Platform"]
  },
  {
    id: "predictive",
    name: "Predictive Intelligence",
    problem: "Anticipar eventos operativos y de negocio antes de que ocurran.",
    solution: "Modelos predictivos y forecasting para anticipación y planificación.",
    technology: "Predictive Models · Forecasting.",
    benefit: "Anticipación y mejor asignación de recursos.",
    products: ["Predictive Intelligence Platform AI"]
  },
  {
    id: "data-ai",
    name: "Data & AI",
    problem: "Datos dispersos y procesos manuales que frenan la toma de decisiones.",
    solution: "Ingeniería de datos, automatización e IA como base transversal de la plataforma.",
    technology: "Data Engineering · Automation · Artificial Intelligence.",
    benefit: "Base confiable y auditable para todas las capacidades.",
    products: ["Crew Optimization AI"]
  }
];

export default function SolucionesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Soluciones"
        title="Tecnología organizada por lo que resuelve"
        description="No es una lista de productos: son capacidades agrupadas por el problema que abordan."
      />

      <section className="container-enitma section space-y-6">
        {CATEGORIES.map((c) => (
          <article key={c.id} id={c.id} className="card scroll-mt-24">
            <h2 className="t-h3 text-xl">{c.name}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Problema" value={c.problem} />
              <Field label="Solución" value={c.solution} />
              <Field label="Tecnología" value={c.technology} />
              <Field label="Beneficio" value={c.benefit} />
            </div>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="t-caption mb-2 uppercase tracking-wider">Productos relacionados</p>
              <div className="flex flex-wrap gap-2">
                {c.products.map((p) => (
                  <span key={p} className="badge badge-info">{p}</span>
                ))}
              </div>
            </div>
          </article>
        ))}

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <Link href="/aviation" className="btn-primary">Ver Aviation Intelligence</Link>
          <Link href="/contacto" className="btn-ghost">Hablar con enITma</Link>
        </div>
      </section>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="t-caption mb-1 uppercase tracking-wider text-signal-400">{label}</p>
      <p className="t-small text-slate-300">{value}</p>
    </div>
  );
}
