import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SpaceAssistant from "@/components/SpaceAssistant";

export const metadata: Metadata = {
  metadataBase: new URL("https://enitma.com"),
  title: "enITma — Aviation Technology & Intelligence",
  description:
    "enITma combina datos, inteligencia artificial y conocimiento del negocio para transformar la toma de decisiones en la industria aérea. Intelligence that moves industries forward.",
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "enITma — Aviation Technology & Intelligence",
    description:
      "Intelligence that moves industries forward. Datos, IA y automatización para la industria aérea, con aplicaciones potenciales a la industria espacial.",
    siteName: "enITma"
  },
  twitter: {
    card: "summary_large_image",
    title: "enITma — Aviation Technology & Intelligence",
    description: "Intelligence that moves industries forward."
  }
};

const NAV = [
  { label: "Inicio", href: "/" },
  { label: "Aviation Intelligence", href: "/#aviation" },
  { label: "Space Technology", href: "/#space" },
  { label: "Tecnologías", href: "/#technologies" },
  { label: "Contacto", href: "/#contact" }
];

// JSON-LD Organization + WebSite (sin datos estructurados falsos).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "enITma",
      description:
        "Empresa de software para la industria aérea que combina datos, inteligencia artificial y conocimiento del negocio.",
      slogan: "The efficiency experts",
      url: "https://enitma.com"
    },
    {
      "@type": "WebSite",
      name: "enITma — Aviation Technology & Intelligence",
      url: "https://enitma.com"
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">Saltar al contenido</a>

        <header className="sticky top-0 z-40 border-b border-white/10 bg-space-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
              <span aria-hidden="true" className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 text-sm">e</span>
              enITma
            </Link>
            <nav aria-label="Navegación principal" className="hidden md:block">
              <ul className="flex items-center gap-6">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main id="main">{children}</main>

        <footer className="border-t border-white/10 bg-space-950">
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <p className="text-sm font-semibold text-white">enITma — The efficiency experts</p>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Tecnología, datos e inteligencia artificial para la industria aérea. Aplicaciones
              potenciales a la industria espacial (exploratorias).
            </p>
            <p className="mt-4 text-xs text-slate-500">
              © 2025 enITma S.A. de C.V. · Presencia declarada: EE. UU., México, Guatemala, Honduras,
              El Salvador, Costa Rica, Panamá, Colombia, Perú y España.
            </p>
          </div>
        </footer>

        {/* Asistente enITma Space AI (botón flotante + panel) */}
        <SpaceAssistant />
      </body>
    </html>
  );
}
