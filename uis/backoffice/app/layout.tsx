import type { Metadata } from "next";
import Link from "next/link";
import AppSwitcher from "@/components/AppSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrackFlow — Backoffice interno",
  description: "Panel operativo interno de TrackFlow (People, Comercial y Operaciones)."
};

/** Enlaces de navegación interna del backoffice. */
const NAV = [
  { label: "Panel", href: "/" },
  { label: "Inventario", href: "/inventory/products" },
  { label: "Analizador de Incidencias", href: "/incidents" }
];

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen">
          {/* Barra lateral: layout propio del backoffice, distinto del website. */}
          <aside className="hidden w-60 shrink-0 flex-col bg-ink-900 text-slate-200 md:flex">
            <div className="flex items-center gap-2 px-5 py-4">
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white"
              >
                TF
              </span>
              <span className="text-sm font-semibold text-white">TrackFlow</span>
            </div>
            <p className="px-5 pb-2 text-xs uppercase tracking-wider text-slate-400">
              Backoffice interno
            </p>
            {/* Navegación cruzada entre las apps del proyecto. */}
            <div className="border-y border-white/10 px-4 py-3">
              <p className="mb-1.5 text-[10px] uppercase tracking-wider text-slate-500">Apps</p>
              <AppSwitcher current="backoffice" />
            </div>
            <nav aria-label="Navegación del backoffice" className="px-3 pt-3">
              <ul className="space-y-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between px-4 py-3 sm:px-8">
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">
                    Panel operativo
                  </h1>
                  <p className="text-xs text-slate-500">
                    People &amp; Talent · Comercial · Operaciones
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Uso interno
                </span>
              </div>
            </header>

            <main className="flex-1 px-4 py-6 sm:px-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
