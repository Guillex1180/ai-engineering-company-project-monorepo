import Link from "next/link";
import DataFlow from "@/components/DataFlow";
import IntelligenceGraph, { type GraphNode } from "@/components/IntelligenceGraph";

const AVIATION_NODES: GraphNode[] = [
  {
    key: "financial",
    label: "Financial Intelligence",
    status: "existing",
    description:
      "IA para fortalecer la gestión financiera en aerolíneas: detección de anomalías, prevención de fraude y optimización de ingresos sobre grandes volúmenes de transacciones.",
    technologies: ["Anomaly Detection", "Machine Learning", "Data Engineering"],
    applications: ["Revenue Accounting", "Reconciliación financiera", "Facturación electrónica"],
    benefits: ["Mayor control y transparencia", "Reducción de riesgo de fraude"]
  },
  {
    key: "operational",
    label: "Operational Intelligence",
    status: "existing",
    description: "Analítica e IA aplicadas a la eficiencia operativa de la aerolínea.",
    technologies: ["Predictive Analytics", "Decision Intelligence"],
    applications: ["Optimización operativa", "Gestión de IROPs"],
    benefits: ["Decisiones en tiempo real", "Eficiencia operativa"]
  },
  {
    key: "passenger",
    label: "Passenger Intelligence",
    status: "existing",
    description: "Inteligencia de grafo sobre el comportamiento del viaje del pasajero.",
    technologies: ["Graph Intelligence", "Travel Behavior Graph AI"],
    applications: ["Segmentación", "Experiencia del pasajero"],
    benefits: ["Personalización", "Insights de comportamiento"]
  },
  {
    key: "crew",
    label: "Crew Intelligence",
    status: "existing",
    description: "Gestión de personal de cabina: asignaciones, itinerarios, comunicación y cumplimiento.",
    technologies: ["Optimization", "Compliance"],
    applications: ["Crew Optimization AI", "Cumplimiento de turnos"],
    benefits: ["Operación organizada", "Alineación con estándares de servicio"]
  },
  {
    key: "airport",
    label: "Airport Intelligence",
    status: "existing",
    description: "Cumplimiento de seguridad y turnos en aeropuerto.",
    technologies: ["Compliance", "Automation"],
    applications: ["Security Airport & Shift Compliance"],
    benefits: ["Cumplimiento regulatorio"]
  },
  {
    key: "predictive",
    label: "Predictive Intelligence",
    status: "existing",
    description: "Plataforma predictiva para anticipar eventos operativos y de negocio.",
    technologies: ["Predictive Models", "Forecasting"],
    applications: ["Predicción operativa", "Estimación de riesgo"],
    benefits: ["Anticipación", "Optimización de recursos"]
  }
];

const SPACE_NODES: GraphNode[] = [
  {
    key: "space-ai",
    label: "Space AI",
    status: "potential",
    description:
      "Aplicación potencial: las capacidades de IA de enITma podrían adaptarse a operaciones espaciales. No es un despliegue actual.",
    applications: ["Análisis de datos de misión", "Automatización inteligente"]
  },
  {
    key: "mission",
    label: "Mission Intelligence",
    status: "potential",
    description:
      "Aplicación potencial: inteligencia predictiva y de decisión de enITma adaptada a la planificación de operaciones de misión.",
    applications: ["Planificación de misión", "Optimización de recursos"]
  },
  {
    key: "satellite",
    label: "Satellite Operations",
    status: "potential",
    description:
      "Aplicación potencial: detección de anomalías de enITma adaptada a telemetría de satélites.",
    applications: ["Anomalías de telemetría", "Salud de la constelación"]
  },
  {
    key: "ground",
    label: "Ground Operations",
    status: "potential",
    description: "Aplicación potencial: analítica para operaciones de estaciones terrenas.",
    applications: ["Programación de contactos", "Detección de incidencias"]
  },
  {
    key: "space-data",
    label: "Space Data",
    status: "potential",
    description: "Aplicación potencial: ingeniería de datos para grandes volúmenes de datos espaciales.",
    applications: ["Pipelines de datos", "Data platform"]
  },
  {
    key: "space-docs",
    label: "Document Intelligence",
    status: "potential",
    description:
      "Aplicación potencial: OCR/IDP de enITma adaptado a documentación técnica y de cumplimiento del sector espacial.",
    applications: ["Extracción documental", "Cumplimiento y manifiestos"]
  }
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div aria-hidden="true" className="starfield absolute inset-0 opacity-40" />
        <div aria-hidden="true" className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <span className="eyebrow">Aviation Technology &amp; Intelligence</span>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-6xl">
            Intelligence that moves industries forward.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            enITma combina datos, inteligencia artificial y conocimiento del negocio para
            transformar la toma de decisiones en la industria aérea — con aplicaciones
            potenciales a la industria espacial.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#technologies" className="btn-primary">Explore Technology</Link>
            <Link href="#contact" className="btn-ghost">Talk to enITma</Link>
          </div>
          <div className="mt-12">
            <DataFlow
              label="El flujo de valor de enITma"
              steps={["DATA", "INTELLIGENCE", "PREDICTION", "DECISION", "ACTION"]}
            />
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section id="technologies" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <span className="eyebrow">Tecnologías enITma</span>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Plataformas para la industria aérea</h2>
        <p className="mt-3 max-w-2xl text-slate-400">
          Portafolio de soluciones (según el sitio oficial de enITma). El detalle profundo de cada
          producto queda como <em>PENDING VALIDATION</em> salvo lo publicado.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Airline Travel Intelligence Platform", "Plataforma de inteligencia de viaje para aerolíneas."],
            ["Travel Behavior Graph AI", "Inteligencia de grafo sobre el comportamiento del pasajero."],
            ["Financial Trust AI", "Detección de anomalías, prevención de fraude y optimización de ingresos."],
            ["Predictive Intelligence Platform AI", "Anticipación de eventos operativos y de negocio."],
            ["Crew Optimization AI", "Gestión de personal de cabina y cumplimiento operativo."],
            ["Security Airport & Shift Compliance", "Cumplimiento de seguridad y turnos en aeropuerto."]
          ].map(([title, desc]) => (
            <article key={title} className="card">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* AVIATION INTELLIGENCE */}
      <section id="aviation" className="border-y border-white/10 bg-space-900/50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <span className="eyebrow">Ecosistema</span>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">enITma Aviation Intelligence</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
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
          <div className="mt-8">
            <DataFlow
              label="Intelligent Document Processing"
              steps={["DOCUMENT", "OCR / IDP", "EXTRACTION", "RULES", "AI ANALYSIS", "ANOMALY", "APPROVAL", "ENTERPRISE SYSTEM"]}
            />
          </div>
        </div>
      </section>

      {/* SPACE TECHNOLOGY */}
      <section id="space" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <span className="eyebrow">Nueva vertical tecnológica</span>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">enITma Space Technology</h2>
        <div className="mt-3 max-w-3xl rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 text-sm text-sky-200">
          <strong>Aplicaciones potenciales.</strong> Esta sección presenta cómo las capacidades
          tecnológicas existentes de enITma <em>podrían</em> adaptarse a la industria espacial. enITma
          no afirma trabajar actualmente con agencias espaciales, fabricantes de satélites ni misiones.
        </div>
        <div className="mt-10">
          <IntelligenceGraph centerLabel="enITma Space Intelligence" nodes={SPACE_NODES} />
        </div>
        <div className="mt-12">
          <DataFlow
            label="Flujo de inteligencia espacial (potencial)"
            steps={["SATELLITE", "TELEMETRY", "DATA PLATFORM", "AI", "ANOMALY", "PREDICTION", "DECISION"]}
          />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-white/10 bg-space-900/50">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
          <span className="eyebrow">Contacto</span>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Let&apos;s transform aviation together</h2>
          <p className="mt-3 text-slate-400">
            Explore the future of Space Intelligence with enITma. Cuéntanos sobre tu organización y te contactaremos.
          </p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  return (
    <form className="mt-8 space-y-4" action="#" method="post">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-300">Nombre</label>
          <input id="name" name="name" required className="block w-full rounded-lg border border-white/15 bg-space-950 px-3 py-2 text-sm text-white" />
        </div>
        <div>
          <label htmlFor="company" className="mb-1 block text-sm font-medium text-slate-300">Organización</label>
          <input id="company" name="company" className="block w-full rounded-lg border border-white/15 bg-space-950 px-3 py-2 text-sm text-white" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-300">Email corporativo</label>
        <input id="email" name="email" type="email" required className="block w-full rounded-lg border border-white/15 bg-space-950 px-3 py-2 text-sm text-white" />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-300">Mensaje</label>
        <textarea id="message" name="message" rows={4} className="block w-full rounded-lg border border-white/15 bg-space-950 px-3 py-2 text-sm text-white" />
      </div>
      <button type="submit" className="btn-primary">Enviar</button>
      <p className="text-xs text-slate-500">Formulario de demostración: el envío no está conectado a un backend en este MVP.</p>
    </form>
  );
}
