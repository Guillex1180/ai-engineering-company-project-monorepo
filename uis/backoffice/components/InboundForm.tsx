"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  createInboundOrder,
  getProducts,
  InventoryApiError,
  type InventoryProduct
} from "@/lib/inventory";

type LoadPhase = "loading" | "ready" | "error";

export default function InboundForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("product");

  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loadPhase, setLoadPhase] = useState<LoadPhase>("loading");
  const [loadError, setLoadError] = useState("");

  const [productId, setProductId] = useState<string>(preselected ?? "");
  const [quantity, setQuantity] = useState<string>("");
  const [fieldError, setFieldError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getProducts();
        if (!active) return;
        setProducts(data);
        setLoadPhase("ready");
      } catch (err) {
        if (!active) return;
        setLoadError(err instanceof InventoryApiError ? err.message : "No fue posible cargar los productos.");
        setLoadPhase("error");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId) ?? null,
    [products, productId]
  );

  function validate(): boolean {
    if (!productId) {
      setFieldError("Selecciona un producto.");
      return false;
    }
    const qty = Number(quantity);
    if (quantity.trim() === "" || !Number.isInteger(qty) || qty <= 0) {
      setFieldError("Introduce una cantidad válida (entero mayor que 0).");
      return false;
    }
    setFieldError("");
    return true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    if (submitting || !validate()) return;
    setSubmitting(true);
    try {
      const order = await createInboundOrder({ product_id: productId, quantity: Number(quantity) });
      setFeedback({
        kind: "success",
        message: `Entrada registrada correctamente: ${order.quantity} uds. de ${order.product_name}.`
      });
      setQuantity("");
    } catch (err) {
      setFeedback({
        kind: "error",
        message: err instanceof InventoryApiError ? err.message : "No se pudo registrar la entrada."
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loadPhase === "loading") {
    return <p role="status" className="text-sm text-slate-500">Cargando productos…</p>;
  }
  if (loadPhase === "error") {
    return <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{loadError}</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card max-w-lg space-y-4">
      <div>
        <label htmlFor="product" className="stat-label">Producto</label>
        <select
          id="product"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
        >
          <option value="">Selecciona un producto…</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.sku})
            </option>
          ))}
        </select>
      </div>

      {selectedProduct ? (
        <p className="text-sm text-slate-600">
          Stock actual: <strong>{selectedProduct.current_stock}</strong>
        </p>
      ) : null}

      <div>
        <label htmlFor="quantity" className="stat-label">Cantidad recibida</label>
        <input
          id="quantity"
          type="number"
          min={1}
          step={1}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={quantity}
          aria-invalid={fieldError ? "true" : undefined}
          aria-describedby={fieldError ? "quantity-error" : undefined}
          onChange={(event) => setQuantity(event.target.value)}
        />
        {fieldError ? (
          <p id="quantity-error" className="mt-1 text-sm font-medium text-red-600">{fieldError}</p>
        ) : null}
      </div>

      <div aria-live="polite">
        {feedback ? (
          <p
            role={feedback.kind === "error" ? "alert" : "status"}
            className={
              feedback.kind === "success"
                ? "rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
                : "rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            }
          >
            {feedback.message}
          </p>
        ) : null}
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Registrando…" : "Registrar entrada"}
      </button>
    </form>
  );
}
