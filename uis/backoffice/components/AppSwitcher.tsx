/**
 * Selector de apps del proyecto TrackFlow (navegación cruzada).
 *
 * Enlaza las tres aplicaciones entre sí. Las URLs vienen de variables de entorno
 * públicas (NEXT_PUBLIC_*), con valores de desarrollo por defecto. La app actual
 * se marca como "current" y no enlaza a sí misma.
 */
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000";
const BACKOFFICE_URL = process.env.NEXT_PUBLIC_BACKOFFICE_URL ?? "http://localhost:3001";
const TALENT_URL = process.env.NEXT_PUBLIC_TALENT_URL ?? "http://localhost:3002";

type AppKey = "website" | "backoffice" | "talent";

const APPS: { key: AppKey; label: string; href: string }[] = [
  { key: "website", label: "Sitio web", href: WEBSITE_URL },
  { key: "backoffice", label: "Backoffice", href: BACKOFFICE_URL },
  { key: "talent", label: "Talent", href: TALENT_URL }
];

export default function AppSwitcher({ current }: { current: AppKey }) {
  return (
    <nav aria-label="Aplicaciones de TrackFlow" className="flex items-center gap-1">
      {APPS.map((app) =>
        app.key === current ? (
          <span
            key={app.key}
            aria-current="page"
            className="rounded-md bg-white/15 px-2.5 py-1 text-xs font-semibold text-white"
          >
            {app.label}
          </span>
        ) : (
          <a
            key={app.key}
            href={app.href}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            {app.label}
          </a>
        )
      )}
    </nav>
  );
}
