"use client";

import { useState } from "react";

/**
 * Formulario de contacto simplificado (sección 32).
 * Envío de demostración: no está conectado a un backend en este MVP; muestra
 * un estado de éxito accesible. Cuando exista backend, se conecta aquí.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // Simulación breve de envío para dar feedback visual.
    window.setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 500);
  }

  if (sent) {
    return (
      <div role="status" className="card border-success-500/30 bg-success-500/10">
        <p className="flex items-center gap-2 text-lg font-semibold text-success-400">
          <span aria-hidden="true">✓</span> Mensaje enviado
        </p>
        <p className="mt-2 t-small">Nuestro equipo se pondrá en contacto contigo.</p>
        <button
          type="button"
          className="btn-secondary mt-4 px-4 py-2"
          onClick={() => setSent(false)}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label="Nombre" required />
        <Field id="company" label="Empresa" />
      </div>
      <Field id="email" label="Correo" type="email" required />
      <div>
        <label htmlFor="interest" className="mb-1 block text-sm font-medium text-slate-300">Interés</label>
        <select
          id="interest"
          name="interest"
          className="block w-full rounded-lg border border-white/15 bg-space-950 px-3 py-2 text-sm text-white"
        >
          <option>Aviation Intelligence</option>
          <option>Financial Intelligence</option>
          <option>Space Technology</option>
          <option>Data &amp; AI</option>
          <option>Otro</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-300">Mensaje</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="block w-full rounded-lg border border-white/15 bg-space-950 px-3 py-2 text-sm text-white"
        />
      </div>
      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Enviando…" : "Enviar mensaje"}
      </button>
      <p className="t-caption">Formulario de demostración: el envío no está conectado a un backend en este MVP.</p>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required = false
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="block w-full rounded-lg border border-white/15 bg-space-950 px-3 py-2 text-sm text-white"
      />
    </div>
  );
}
