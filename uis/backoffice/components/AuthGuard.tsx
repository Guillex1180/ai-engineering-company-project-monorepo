"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

/**
 * Protege una vista: si no hay sesión, redirige al login existente.
 * Patrón único de protección del backoffice; las páginas de inventario lo
 * envuelven. Evita parpadeo renderizando null hasta comprobar la sesión.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setAllowed(true);
    } else {
      router.replace("/login");
    }
    setChecked(true);
  }, [router]);

  if (!checked || !allowed) {
    return (
      <p role="status" className="text-sm text-slate-500">
        Comprobando sesión…
      </p>
    );
  }
  return <>{children}</>;
}
