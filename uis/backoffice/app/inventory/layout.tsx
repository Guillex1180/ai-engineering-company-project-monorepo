import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

/** Subnavegación de la sección Inventario. */
const SUBNAV = [
  { label: "Productos", href: "/inventory/products" },
  { label: "Registrar entrada", href: "/inventory/orders/inbound" },
  { label: "Registrar salida", href: "/inventory/orders/outbound" },
  { label: "Historial de órdenes", href: "/inventory/orders" }
];

export default function InventoryLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventario</h1>
          <p className="mt-1 text-sm text-slate-600">
            Gestión de productos y órdenes de almacén de TrackFlow.
          </p>
        </header>

        <nav aria-label="Secciones de inventario" className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {SUBNAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div>{children}</div>
      </div>
    </AuthGuard>
  );
}
