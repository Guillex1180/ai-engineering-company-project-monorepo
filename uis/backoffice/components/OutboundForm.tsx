"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  createOutboundOrder,
  getProducts,
  InventoryApiError,
  type InventoryProduct
} from "@/lib/inventory";

type LoadPhase = "loading" | "ready" | "error";

export default function OutboundForm() {
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

  const refreshProducts = useCallback(async () => {
    const data = await getProducts();
    setProducts(data);
    return data;
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await refreshProducts();
        if (active) setLoadPhase("ready");
      } catch (err) {
        if (!active) return;
        setLoadError(err instanceof InventoryApiError ? err.message : "No fue posible cargar los productos.");
        setLoadPhase("error");
      }
    })();
    return () => {
      active = false;
    };
  }, [refreshProducts]);

  // Stock reactivo: se recalcula al cambiar de producto o tras un refresco.
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId) ?? null,
    [products, productId]
  );
  const currentStock = selectedProduct?.current_stock ?? null;

  // Advertencia UX cuando la cantidad supera el stock conocido.
  const numericQty = Number(quantity);
  const exceedsStock =
    selectedProduct !== null &&
    quantity.trim() !== "" &&
    Number.isFinite(numericQty) &&
    numericQty > selectedProduct.current_stock;

  function validate(): boolean {
    if (!productId) {
      setFieldError("Selecciona un producto.");
      return false;
    }
    if (quantity.trim() === "" || !Number.isInteger(numericQty) || numericQty <= 0) {
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
      const order = await createOutboundOrder({ product_id: productId, quantity: numericQty });
      setFeedback({
        kind: "success",
        message: `Salida registrada correctamente: ${order.quantity} uds. de ${order.product_name}.`
      });
      setQuantity("");
      // Refresca el stock para reflejar el nuevo current_stock sin recargar.
      await refreshProducts();
    } catch (err) {
      const message =
        err instanceof InventoryApiError ? err.message : "No se pudo registrar la salida.";
      if (err instanceof InventoryApiError && err.status === 400) {
        // Stock insuficiente según el backend: mensaje INLINE junto al campo.
        setFieldError(message);
      } else {
        setFeedback({ kind: "error", message });
      }
      // Refresca por si el stock cambió entre la consulta y el POST.
      try {
        await refreshProducts();
      } catch {
        /* el error principal ya se mostró */
      }
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
          onChange={(event) => {
            setProductId(event.target.value);
            setFieldError("");
          }}
        >
          <option value="">Selecciona un producto…</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.sku})
            </option>
          ))}
        </select>
      </div>

      {/* Stock disponible ANTES del envío, reactivo al producto seleccionado. */}
      {selectedProduct ? (
        <p aria-live="polite" className="text-sm text-slate-700">
          Stock disponible: <strong>{currentStock}</strong>
        </p>
      ) : null}

      <div>
        <label htmlFor="quantity" className="stat-label">Cantidad a enviar</label>
        <input
          id="quantity"
          type="number"
          min={1}
          step={1}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={quantity}
          aria-invalid={fieldError || exceedsStock ? "true" : undefined}
          aria-describedby="quantity-help"
          onChange={(event) => {
            setQuantity(event.target.value);
            if (fieldError) setFieldError("");
          }}
        />
        <div id="quantity-help" aria-live="polite">
          {exceedsStock && selectedProduct ? (
            <p className="mt-1 text-sm font-medium text-amber-700">
              La cantidad solicitada supera el stock disponible ({selectedProduct.current_stock}).
            </p>
          ) : null}
          {fieldError ? (
            <p className="mt-1 text-sm font-medium text-red-600">{fieldError}</p>
          ) : null}
        </div>
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

      <button type="submit" className="btn-primary" disabled={submitting || exceedsStock}>
        {submitting ? "Registrando…" : "Registrar salida"}
      </button>
    </form>
  );
}
