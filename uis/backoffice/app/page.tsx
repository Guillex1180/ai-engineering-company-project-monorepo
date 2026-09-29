import {
  DEMO_LEADS,
  DEMO_SERVICES,
  type InterestService,
  type ProductType
} from "@/lib/demo-data";
import {
  interestByService,
  leadsByProduct,
  operationalSummary,
  qualificationRate,
  totalLeads
} from "@/lib/metrics";
import LeadsTable from "@/components/LeadsTable";

export default function DashboardPage() {
  // Cálculos derivados (lógica de negocio) sobre los datos de demostración.
  const total = totalLeads(DEMO_LEADS);
  const qualification = qualificationRate(DEMO_LEADS);
  const byProduct = leadsByProduct(DEMO_LEADS);
  const byService = interestByService(DEMO_LEADS);
  const ops = operationalSummary(DEMO_SERVICES);

  const productEntries = Object.entries(byProduct) as [ProductType, number][];
  const serviceEntries = Object.entries(byService) as [InterestService, number][];

  return (
    <div className="space-y-10">
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
        Datos de demostración — no provienen de una API real. Derivados del dominio
        definido en CONTEXT.md.
      </p>

      {/* --------------------------- Panel de métricas --------------------------- */}
      <section id="panel" aria-label="Resumen operativo" className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Resumen</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat">
            <p className="stat-label">Solicitudes totales</p>
            <p className="stat-value">{total}</p>
          </div>
          <div className="stat">
            <p className="stat-label">Tasa de calificación</p>
            <p className="stat-value">{qualification}%</p>
          </div>
          <div className="stat">
            <p className="stat-label">Servicios operativos</p>
            <p className="stat-value">
              {ops.active}/{ops.total}
            </p>
          </div>
          <div className="stat">
            <p className="stat-label">Mercados</p>
            <p className="stat-value">2</p>
            <p className="mt-1 text-xs text-slate-500">Estados Unidos · España</p>
          </div>
        </div>
      </section>

      {/* --------------------------- Distribuciones --------------------------- */}
      <section aria-label="Distribución de solicitudes" className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-900">
            Solicitudes por tipo de producto
          </h3>
          <ul className="mt-4 space-y-2">
            {productEntries.map(([product, count]) => (
              <li key={product} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{product}</span>
                <span className="font-semibold text-slate-900">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-slate-900">
            Interés por servicio
          </h3>
          <ul className="mt-4 space-y-2">
            {serviceEntries.map(([service, count]) => (
              <li key={service} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{service}</span>
                <span className="font-semibold text-slate-900">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------- Solicitudes (filtro) --------------------------- */}
      <section id="solicitudes" aria-label="Solicitudes de información" className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Solicitudes de información</h2>
        <LeadsTable />
      </section>

      {/* --------------------------- Operaciones --------------------------- */}
      <section id="operaciones" aria-label="Estado operativo" className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Estado operativo por almacén</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3">Servicio</th>
                <th scope="col" className="px-4 py-3">País</th>
                <th scope="col" className="px-4 py-3">Almacén</th>
                <th scope="col" className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEMO_SERVICES.map((service) => (
                <tr key={`${service.name}-${service.country}`}>
                  <td className="px-4 py-3 font-medium text-slate-900">{service.name}</td>
                  <td className="px-4 py-3 text-slate-600">{service.country}</td>
                  <td className="px-4 py-3 text-slate-600">{service.warehouseCity}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        service.operational
                          ? "inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800"
                          : "inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700"
                      }
                    >
                      {service.operational ? "Operativo" : "En mantenimiento"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
