"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      router.replace("/inventory/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-slate-600">
          Acceso al backoffice de TrackFlow (People, Comercial y Operaciones).
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="card space-y-4">
        <div>
          <label htmlFor="username" className="stat-label">Usuario</label>
          <input
            id="username"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={username}
            autoComplete="username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="stat-label">Contraseña</label>
          <input
            id="password"
            type="password"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Entrando…" : "Entrar"}
        </button>

        <p className="text-xs text-slate-400">
          Demo: usuario <code>operaciones</code> · contraseña <code>trackflow</code>
        </p>
      </form>
    </div>
  );
}
