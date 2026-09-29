"use client";

import { useRef, useState } from "react";
import { analyzeCsv, exportUrl, type AnalysisResult } from "@/lib/incidents-api";

type UiState = "initial" | "file_selected" | "loading" | "success" | "error";

/** Etiquetas legibles para categorías, estados y motivos de invalidez. */
const CATEGORY_LABELS: Record<string, string> = {
  almacen: "Almacén",
  ultima_milla: "Última milla",
  logistica_inversa: "Logística inversa"
};
const STATUS_LABELS: Record<string, string> = {
  recibida: "Recibida",
  en_proceso: "En proceso",
  resuelta: "Resuelta",
  cerrada: "Cerrada",
  descartada: "Descartada"
};
const REASON_LABELS: Record<string, string> = {
  missing_required: "Campos obligatorios faltantes",
  invalid_category: "Categoría inválida",
  invalid_status: "Estado inválido"
};

function label(map: Record<string, string>, key: string): string {
  return map[key] ?? key;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function IncidentAnalyzer() {
  const [state, setState] = useState<UiState>("initial");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  function onSelectFile(selected: File | null) {
    setError("");
    setResult(null);
    if (!selected) {
      setFile(null);
      setState("initial");
      return;
    }
    if (!selected.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setState("error");
      setError("El archivo debe ser un CSV.");
      return;
    }
    setFile(selected);
    setState("file_selected");
  }

  async function onAnalyze() {
    if (!file || state === "loading") return;
    setState("loading");
    setError("");
    try {
      const data = await analyzeCsv(file);
      setResult(data);
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo analizar el archivo.");
      setState("error");
    }
  }

  const isLoading = state === "loading";

  return (
    <div className="space-y-6">
      {/* Carga de archivo */}
      <div className="card space-y-4">
        <div>
          <label htmlFor="csv-file" className="stat-label">
            Archivo CSV de incidencias
          </label>
          <input
            ref={inputRef}
            id="csv-file"
            type="file"
            accept=".csv,text/csv"
            disabled={isLoading}
            className="mt-1 block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
            onChange={(event) => onSelectFile(event.target.files?.[0] ?? null)}
          />
        </div>

        {file ? (
          <p className="text-sm text-slate-600">
            Seleccionado: <strong>{file.name}</strong> ({formatSize(file.size)})
          </p>
        ) : null}

        <button
          type="button"
          className="btn-primary"
          disabled={!file || isLoading}
          onClick={onAnalyze}
        >
          {isLoading ? "Analizando incidencias…" : "Analizar archivo"}
        </button>
      </div>

      {/* Estado de error */}
      {state === "error" ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {/* Región viva para anunciar resultados */}
      <div aria-live="polite">
        {state === "success" && result ? (
          <div className="space-y-6">
            {result.invalidRecords > 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Se detectaron <strong>{result.invalidRecords}</strong> registros inválidos.
                Estos registros fueron excluidos de las métricas principales.
              </div>
            ) : null}

            {/* Resumen general */}
            <section aria-label="Resumen general" className="grid gap-4 sm:grid-cols-3">
              <div className="stat">
                <p className="stat-label">Procesados</p>
                <p className="stat-value">{result.totalProcessed}</p>
              </div>
              <div className="stat">
                <p className="stat-label">Válidos</p>
                <p className="stat-value">{result.validRecords}</p>
              </div>
              <div className="stat">
                <p className="stat-label">Inválidos</p>
                <p className="stat-value">{result.invalidRecords}</p>
              </div>
            </section>

            {/* Categoría y estado */}
            <div className="grid gap-6 lg:grid-cols-2">
              <section aria-label="Incidencias por categoría" className="card">
                <h3 className="text-sm font-semibold text-slate-900">Por categoría</h3>
                <ul className="mt-4 space-y-2">
                  {Object.entries(result.byCategory).map(([key, count]) => (
                    <li key={key} className="flex justify-between text-sm">
                      <span className="text-slate-600">{label(CATEGORY_LABELS, key)}</span>
                      <span className="font-semibold text-slate-900">{count}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-label="Incidencias por estado" className="card">
                <h3 className="text-sm font-semibold text-slate-900">Por estado</h3>
                <ul className="mt-4 space-y-2">
                  {Object.entries(result.byStatus).map(([key, count]) => (
                    <li key={key} className="flex justify-between text-sm">
                      <span className="text-slate-600">{label(STATUS_LABELS, key)}</span>
                      <span className="font-semibold text-slate-900">{count}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Satisfacción */}
            <section aria-label="Satisfacción" className="card">
              <h3 className="text-sm font-semibold text-slate-900">Satisfacción</h3>
              <div className="mt-3 flex flex-wrap gap-8 text-sm">
                <div>
                  <p className="stat-label">Promedio</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {result.averageSatisfaction === null
                      ? "N/A"
                      : result.averageSatisfaction.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="stat-label">Casos incluidos</p>
                  <p className="text-2xl font-bold text-slate-900">{result.satisfactionCases}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Solo incidencias cerradas con puntuación registrada.
              </p>
            </section>

            {/* Registros inválidos */}
            <section aria-label="Registros inválidos" className="card">
              <h3 className="text-sm font-semibold text-slate-900">Registros inválidos</h3>
              <ul className="mt-4 space-y-2">
                {Object.entries(result.invalidReasons).map(([key, count]) => (
                  <li key={key} className="flex justify-between text-sm">
                    <span className="text-slate-600">{label(REASON_LABELS, key)}</span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Descarga */}
            <a href={exportUrl()} className="btn-primary inline-flex" download>
              Descargar resultados CSV
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
