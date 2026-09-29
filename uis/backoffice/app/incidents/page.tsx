import Link from "next/link";
import IncidentAnalyzer from "@/components/IncidentAnalyzer";

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm font-medium text-brand-700 hover:text-brand-800">
          ← Volver al panel
        </Link>
      </div>

      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          TrackFlow
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Analizador de Incidencias
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Carga un archivo CSV para validar los registros y consultar las métricas
          de incidencias. El procesamiento es interno y no se comparte con servicios externos.
        </p>
      </header>

      <IncidentAnalyzer />
    </div>
  );
}
