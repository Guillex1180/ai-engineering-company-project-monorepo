"use client";

import { useCallback, useEffect, useState } from "react";
import { getOrders, InventoryApiError, type InventoryOrder } from "@/lib/inventory";
import { ORDER_TYPE_LABELS, formatDateTime } from "@/lib/inventory-labels";

type Phase = "loading" | "success" | "empty" | "error";

function TypeBadge({ type }: { type: InventoryOrder["type"] }) {
  const isInbound = type === "inbound";
  return (
    <span
      className={
        isInbound
          ? "inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800"
          : "inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800"
      }
    >
      <span aria-hidden="true">{isInbound ? "↓" : "↑"}</span>
      {ORDER_TYPE_LABELS[type]}
    </span>
  );
}

export default function OrdersView() {
  const [orders, setOrders] = useState<InventoryOrder[]>([]);
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setPhase("loading");
    setError("");
    try {
      const data = await getOrders();
      setOrders(data);
      setPhase(data.length === 0 ? "empty" : "success");
    } catch (err) {
      setError(err instanceof InventoryApiError ? err.message : "No fue posible cargar el historial.");
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (phase === "loading") {
    return <p role="status" className="text-sm text-slate-500">Cargando historial…</p>;
  }
  if (phase === "error") {
    return (
      <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error}
        <button type="button" className="btn-primary mt-3" onClick={() => void load()}>Reintentar</button>
      </div>
    );
  }
  if (phase === "empty") {
    return <p role="status" className="text-sm text-slate-600">Aún no hay órdenes registradas.</p>;
  }

  return (
    <>
      {/* Tabla en escritorio */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3">Producto</th>
              <th scope="col" className="px-4 py-3">Tipo</th>
              <th scope="col" className="px-4 py-3">Cantidad</th>
              <th scope="col" className="px-4 py-3">Fecha</th>
              <th scope="col" className="px-4 py-3">Usuario</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{order.product_name}</td>
                <td className="px-4 py-3"><TypeBadge type={order.type} /></td>
                <td className="px-4 py-3 text-slate-700">{order.quantity}</td>
                <td className="px-4 py-3 text-slate-600">{formatDateTime(order.created_at)}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{order.user_uuid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas en móvil */}
      <ul className="space-y-3 md:hidden">
        {orders.map((order) => (
          <li key={order.id} className="card">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-slate-900">{order.product_name}</span>
              <TypeBadge type={order.type} />
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Cantidad: <strong>{order.quantity}</strong> · {formatDateTime(order.created_at)}
            </p>
            <p className="mt-1 font-mono text-xs text-slate-400">{order.user_uuid}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
