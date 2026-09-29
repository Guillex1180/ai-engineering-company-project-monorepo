"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, InventoryApiError, type InventoryProduct } from "@/lib/inventory";
import { CATEGORY_LABELS, WAREHOUSE_LABELS, labelFor } from "@/lib/inventory-labels";
import StockBadge from "./StockBadge";

type Phase = "loading" | "success" | "empty" | "error";

export default function ProductsView() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setPhase("loading");
    setError("");
    try {
      const data = await getProducts();
      setProducts(data);
      setPhase(data.length === 0 ? "empty" : "success");
    } catch (err) {
      setError(err instanceof InventoryApiError ? err.message : "No fue posible cargar el inventario.");
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (phase === "loading") {
    return <p role="status" className="text-sm text-slate-500">Cargando inventario…</p>;
  }
  if (phase === "error") {
    return (
      <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error}
        <button type="button" className="btn-primary mt-3" onClick={() => void load()}>
          Reintentar
        </button>
      </div>
    );
  }
  if (phase === "empty") {
    return <p role="status" className="text-sm text-slate-600">No hay productos disponibles.</p>;
  }

  return (
    <>
      {/* Tabla en escritorio */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3">Producto</th>
              <th scope="col" className="px-4 py-3">SKU</th>
              <th scope="col" className="px-4 py-3">Categoría</th>
              <th scope="col" className="px-4 py-3">Almacén</th>
              <th scope="col" className="px-4 py-3">Stock actual</th>
              <th scope="col" className="px-4 py-3">Nivel</th>
              <th scope="col" className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
                <td className="px-4 py-3 text-slate-500">{product.sku}</td>
                <td className="px-4 py-3 text-slate-600">{labelFor(CATEGORY_LABELS, product.category)}</td>
                <td className="px-4 py-3 text-slate-600">{labelFor(WAREHOUSE_LABELS, product.warehouse)}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{product.current_stock}</td>
                <td className="px-4 py-3"><StockBadge stock={product.current_stock} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/inventory/orders/inbound?product=${product.id}`} className="text-xs font-semibold text-brand-700 hover:underline">
                      Registrar entrada
                    </Link>
                    <Link href={`/inventory/orders/outbound?product=${product.id}`} className="text-xs font-semibold text-brand-700 hover:underline">
                      Registrar salida
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas en móvil */}
      <ul className="space-y-3 md:hidden">
        {products.map((product) => (
          <li key={product.id} className="card">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-slate-900">{product.name}</span>
              <StockBadge stock={product.current_stock} />
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {labelFor(CATEGORY_LABELS, product.category)} · {labelFor(WAREHOUSE_LABELS, product.warehouse)} ·
              Stock: <strong>{product.current_stock}</strong>
            </p>
            <div className="mt-3 flex gap-4">
              <Link href={`/inventory/orders/inbound?product=${product.id}`} className="text-sm font-semibold text-brand-700">
                Registrar entrada
              </Link>
              <Link href={`/inventory/orders/outbound?product=${product.id}`} className="text-sm font-semibold text-brand-700">
                Registrar salida
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
