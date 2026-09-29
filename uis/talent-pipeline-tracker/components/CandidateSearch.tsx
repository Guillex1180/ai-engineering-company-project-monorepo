"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Búsqueda por nombre o email. Escribe el término en la URL (?search=) con un
 * pequeño debounce, sin recargar la página. Se combina con estado y etapa.
 */
export default function CandidateSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState<string>(searchParams.get("search") ?? "");

  // Sincroniza el input si la URL cambia por otra vía (p. ej. navegación).
  useEffect(() => {
    setTerm(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (term === current) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (term.trim()) {
        params.set("search", term.trim());
      } else {
        params.delete("search");
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 350);

    return () => clearTimeout(timeout);
  }, [term, pathname, router, searchParams]);

  return (
    <div>
      <label htmlFor="search" className="field-label">
        Buscar candidatura
      </label>
      <input
        id="search"
        type="search"
        className="field-input"
        placeholder="Nombre o email…"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
      />
    </div>
  );
}
