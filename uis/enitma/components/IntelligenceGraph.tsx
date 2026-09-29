"use client";

import { useState } from "react";

export interface GraphNode {
  key: string;
  label: string;
  description: string;
  technologies?: string[];
  applications?: string[];
  benefits?: string[];
  /** Marca si es capacidad existente o aplicación potencial (para Space). */
  status?: "existing" | "potential";
}

/**
 * Grafo de inteligencia interactivo: un centro y una lista de nodos
 * seleccionables. Al elegir un nodo, muestra su detalle. Accesible por teclado
 * (botones reales, aria-pressed) y sin depender solo del color.
 */
export default function IntelligenceGraph({
  centerLabel,
  nodes
}: {
  centerLabel: string;
  nodes: GraphNode[];
}) {
  const [activeKey, setActiveKey] = useState<string>(nodes[0]?.key ?? "");
  const active = nodes.find((n) => n.key === activeKey) ?? nodes[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Nodos */}
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-signal-400/40 bg-signal-500/10 px-4 py-2 text-sm font-semibold text-signal-400">
          <span aria-hidden="true" className="pulse-dot" />
          {centerLabel}
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {nodes.map((node) => {
            const selected = node.key === active?.key;
            return (
              <li key={node.key}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveKey(node.key)}
                  className={
                    "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors " +
                    (selected
                      ? "border-signal-400 bg-signal-500/15 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:text-white")
                  }
                >
                  {node.label}
                  {node.status ? (
                    <span
                      className={
                        "ml-2 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide " +
                        (node.status === "existing"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-sky-500/20 text-sky-300")
                      }
                    >
                      {node.status === "existing" ? "Existente" : "Potencial"}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Detalle del nodo activo */}
      {active ? (
        <div className="card" aria-live="polite">
          <h3 className="text-xl font-semibold text-white">{active.label}</h3>
          <p className="mt-2 text-slate-300">{active.description}</p>

          {active.technologies?.length ? (
            <div className="mt-4">
              <p className="eyebrow">Tecnologías</p>
              <div className="flex flex-wrap gap-2">
                {active.technologies.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{t}</span>
                ))}
              </div>
            </div>
          ) : null}

          {active.applications?.length ? (
            <div className="mt-4">
              <p className="eyebrow">Aplicaciones</p>
              <ul className="space-y-1 text-sm text-slate-300">
                {active.applications.map((a) => (
                  <li key={a} className="flex gap-2"><span aria-hidden="true" className="text-signal-400">›</span>{a}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {active.benefits?.length ? (
            <div className="mt-4">
              <p className="eyebrow">Beneficios</p>
              <ul className="space-y-1 text-sm text-slate-300">
                {active.benefits.map((b) => (
                  <li key={b} className="flex gap-2"><span aria-hidden="true" className="text-emerald-400">✓</span>{b}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
