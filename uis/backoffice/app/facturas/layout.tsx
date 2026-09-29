import AuthGuard from "@/components/AuthGuard";

/**
 * Layout de la sección Facturas (Fase 1).
 * Sección interna: protegida por AuthGuard, igual que Inventario.
 */
export default function FacturasLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Facturas</h1>
          <p className="mt-1 text-sm text-slate-600">
            Carga y revisa tus facturas de forma segura.
          </p>
        </header>
        <div>{children}</div>
      </div>
    </AuthGuard>
  );
}
