"use client";

import { useMemo, useState } from "react";
import {
  DEMO_LEADS,
  LEAD_STATUS_LABELS,
  type LeadStatus
} from "@/lib/demo-data";
import { filterLeadsByStatus } from "@/lib/metrics";

const STATUS_FILTERS: (LeadStatus | "todos")[] = [
  "todos",
  "nuevo",
  "en_revision",
  "calificado",
  "descartado"
];

/**
 * Tabla de solicitudes con filtro por estado. La lógica de filtrado se ejecuta
 * en el cliente sobre los datos de demostración y el resultado (incluido el
 * conteo) se muestra EN PANTALLA. En móvil se presenta como tarjetas apiladas.
 */
export default function LeadsTable() {
  const [status, setStatus] = useState<LeadStatus | "todos">("todos");

  const leads = useMemo(() => filterLeadsByStatus(DEMO_LEADS, status), [status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <label htmlFor="lead-status" className="stat-label">
            Filtrar por estado
          </label>
          <select
            id="lead-status"
            className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus | "todos")}
          >
            {STATUS_FILTERS.map((value) => (
              <option key={value} value={value}>
                {value === "todos" ? "Todos" : LEAD_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <p aria-live="polite" className="text-sm text-slate-600">
          Mostrando <strong>{leads.length}</strong>{" "}
          {leads.length === 1 ? "solicitud" : "solicitudes"}
        </p>
      </div>

      {/* Tabla en escritorio */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white sm:block">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3">Empresa</th>
              <th scope="col" className="px-4 py-3">País</th>
              <th scope="col" className="px-4 py-3">Producto</th>
              <th scope="col" className="px-4 py-3">Volumen</th>
              <th scope="col" className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{lead.company}</td>
                <td className="px-4 py-3 text-slate-600">{lead.country}</td>
                <td className="px-4 py-3 text-slate-600">{lead.product}</td>
                <td className="px-4 py-3 text-slate-600">{lead.volume}</td>
                <td className="px-4 py-3 text-slate-600">{LEAD_STATUS_LABELS[lead.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas en móvil (tabla no usable en pantallas pequeñas) */}
      <ul className="space-y-3 sm:hidden">
        {leads.map((lead) => (
          <li key={lead.id} className="card">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900">{lead.company}</span>
              <span className="text-xs text-slate-500">{LEAD_STATUS_LABELS[lead.status]}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {lead.country} · {lead.product} · {lead.volume}
            </p>
          </li>
        ))}
      </ul>

      {leads.length === 0 ? (
        <p className="text-sm text-slate-500">No hay solicitudes con este estado.</p>
      ) : null}
    </div>
  );
}
