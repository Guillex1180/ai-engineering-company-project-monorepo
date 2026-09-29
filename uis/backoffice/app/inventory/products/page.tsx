import ProductsView from "@/components/ProductsView";

export default function ProductsPage() {
  return (
    <section aria-label="Productos en inventario" className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Productos</h2>
      <ProductsView />
    </section>
  );
}
