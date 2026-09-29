import { Suspense } from "react";
import OutboundForm from "@/components/OutboundForm";

export default function OutboundPage() {
  return (
    <section aria-label="Registrar salida" className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Registrar salida</h2>
      <p className="text-sm text-slate-600">Registra un envío de mercancía desde el almacén.</p>
      <Suspense fallback={<p className="text-sm text-slate-500">Cargando…</p>}>
        <OutboundForm />
      </Suspense>
    </section>
  );
}
