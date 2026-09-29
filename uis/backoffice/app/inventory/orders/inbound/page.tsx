import { Suspense } from "react";
import InboundForm from "@/components/InboundForm";

export default function InboundPage() {
  return (
    <section aria-label="Registrar entrada" className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Registrar entrada</h2>
      <p className="text-sm text-slate-600">Registra una entrega recibida en el almacén.</p>
      <Suspense fallback={<p className="text-sm text-slate-500">Cargando…</p>}>
        <InboundForm />
      </Suspense>
    </section>
  );
}
