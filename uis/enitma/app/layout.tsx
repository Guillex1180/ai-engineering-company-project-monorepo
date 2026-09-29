import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";
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

        <Navbar />

        <main id="main">{children}</main>

        <footer className="border-t border-white/10 bg-space-950">
          <div className="container-enitma py-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="max-w-sm">
                <p className="flex items-center gap-2 text-lg font-bold text-white">
                  <span aria-hidden="true" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-signal-500 text-sm font-bold text-white">e</span>
                  enITma
                </p>
                <p className="mt-3 t-small">
                  Tecnología, datos e inteligencia artificial para la industria aérea, con
                  aplicaciones potenciales a la industria espacial.
                </p>
              </div>
              <nav aria-label="Enlaces del pie" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                <Link href="/soluciones" className="text-slate-300 hover:text-white">Soluciones</Link>
                <Link href="/aviation" className="text-slate-300 hover:text-white">Aviation</Link>
                <Link href="/space" className="text-slate-300 hover:text-white">Space</Link>
                <Link href="/contacto" className="text-slate-300 hover:text-white">Contacto</Link>
              </nav>
            </div>
            <p className="mt-8 border-t border-white/10 pt-6 t-caption">
              © 2025 enITma S.A. de C.V. · The efficiency experts. Presencia declarada: EE. UU.,
              México, Guatemala, Honduras, El Salvador, Costa Rica, Panamá, Colombia, Perú y España.
            </p>
          </div>
        </footer>

        {/* Asistente enITma Space AI (botón flotante + panel) */}
        <SpaceAssistant />
      </body>
    </html>
  );
}
