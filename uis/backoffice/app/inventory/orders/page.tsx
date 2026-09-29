import OrdersView from "@/components/OrdersView";

export default function OrdersHistoryPage() {
  return (
    <section aria-label="Historial de órdenes" className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Historial de órdenes</h2>
      <p className="text-sm text-slate-600">Registro de entradas y salidas de inventario (solo lectura).</p>
      <OrdersView />
    </section>
  );
}
