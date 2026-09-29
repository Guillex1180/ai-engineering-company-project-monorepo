"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navbar de enITma: sticky, con blur que se intensifica al hacer scroll e
 * indicador de página activa. Navegación simplificada (sección 5).
 *
 * Nota: en Fase 1 las secciones de contenido viven como anclas del Home
 * (`/#...`). En Fase 2 pasarán a rutas propias (`/soluciones`, `/aviation`…)
 * y este arreglo `NAV` se actualizará sin cambiar el resto del componente.
 */
const NAV = [
  { label: "Inicio", href: "/" },
  { label: "Soluciones", href: "/soluciones" },
  { label: "Aviation", href: "/aviation" },
  { label: "Space", href: "/space" },
  { label: "Contacto", href: "/contacto" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "sticky top-0 z-40 border-b transition-colors duration-300 ease-enitma " +
        (scrolled
          ? "border-white/10 bg-space-950/85 backdrop-blur-xl"
          : "border-transparent bg-space-950/40 backdrop-blur-md")
      }
    >
      <div className="container-enitma flex items-center justify-between py-4">
        {/* Logo con presencia */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-signal-500 text-base font-bold text-white shadow-elevated"
          >
            e
          </span>
          <span className="text-xl">enITma</span>
        </Link>

        {/* Navegación desktop */}
        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      "text-sm font-medium transition-colors duration-200 ease-enitma " +
                      (active ? "text-white" : "text-slate-300 hover:text-white")
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/contacto" className="btn-secondary px-4 py-2">
            Hablar con enITma
          </Link>
        </div>

        {/* Botón móvil */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="sr-only">{mobileOpen ? "Cerrar menú" : "Abrir menú"}</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Navegación móvil */}
      {mobileOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Navegación principal (móvil)"
          className="border-t border-white/10 bg-space-950/95 backdrop-blur-xl lg:hidden"
        >
          <ul className="container-enitma flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link
                href="/contacto"
                onClick={() => setMobileOpen(false)}
                className="btn-secondary w-full py-2"
              >
                Hablar con enITma
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
