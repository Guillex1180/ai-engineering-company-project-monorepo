import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrackFlow — People & Talent · Pipeline de Talento",
  description:
    "Herramienta interna de People & Talent de TrackFlow para gestionar el pipeline de candidaturas."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-ink-900 text-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <Link href="/" className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold"
                >
                  TF
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold">TrackFlow — People &amp; Talent</span>
                  <span className="block text-xs text-slate-300">Pipeline de Talento</span>
                </span>
              </Link>
              <nav aria-label="Navegación principal">
                <Link href="/" className="text-sm font-medium text-slate-200 hover:text-white">
                  Candidaturas
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>

          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500 sm:px-6">
              © 2025 TrackFlow · Uso interno de People &amp; Talent
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
