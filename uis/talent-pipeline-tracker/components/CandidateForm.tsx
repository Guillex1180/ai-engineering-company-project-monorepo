"use client";

import { useState } from "react";
import type { CreateCandidateInput } from "@/types/candidate";
import FeedbackMessage from "./FeedbackMessage";

/** Estado del formulario como strings (los inputs manejan texto). */
interface FormValues {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: string;
  linkedin_url: string;
  cv_url: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_VALUES: FormValues = {
  full_name: "",
  email: "",
  phone: "",
  position: "",
  experience_years: "",
  linkedin_url: "",
  cv_url: ""
};

/**
 * Formulario reutilizable para crear y editar candidaturas. Valida los campos
 * requeridos por la API antes de enviar y delega la llamada (POST/PUT) en
 * onSubmit. Muestra loading y error; el éxito lo gestiona el padre (navegación).
 */
export default function CandidateForm({
  initialValues,
  submitLabel,
  onSubmit
}: {
  initialValues?: Partial<CreateCandidateInput>;
  submitLabel: string;
  onSubmit: (input: CreateCandidateInput) => Promise<void>;
}) {
  const [values, setValues] = useState<FormValues>({
    ...EMPTY_VALUES,
    full_name: initialValues?.full_name ?? "",
    email: initialValues?.email ?? "",
    phone: initialValues?.phone ?? "",
    position: initialValues?.position ?? "",
    experience_years:
      initialValues?.experience_years !== undefined
        ? String(initialValues.experience_years)
        : "",
    linkedin_url: initialValues?.linkedin_url ?? "",
    cv_url: initialValues?.cv_url ?? ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  function setField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  /** Valida los campos requeridos por la API. Devuelve los errores encontrados. */
  function validate(current: FormValues): FormErrors {
    const nextErrors: FormErrors = {};
    if (current.full_name.trim().length === 0) {
      nextErrors.full_name = "El nombre completo es obligatorio.";
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(current.email.trim())) {
      nextErrors.email = "Introduce un email válido.";
    }
    if (current.phone.trim().length === 0) {
      nextErrors.phone = "El teléfono es obligatorio.";
    }
    if (current.position.trim().length === 0) {
      nextErrors.position = "El puesto es obligatorio.";
    }
    const years = Number(current.experience_years);
    if (
      current.experience_years.trim() === "" ||
      Number.isNaN(years) ||
      years < 0
    ) {
      nextErrors.experience_years = "Indica los años de experiencia (número ≥ 0).";
    }
    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const input: CreateCandidateInput = {
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      position: values.position.trim(),
      experience_years: Number(values.experience_years),
      linkedin_url: values.linkedin_url.trim() || null,
      cv_url: values.cv_url.trim() || null
    };

    setSubmitting(true);
    try {
      await onSubmit(input);
      // El padre navega en caso de éxito.
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "No se pudo guardar la candidatura."
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="full_name" className="field-label">
          Nombre completo <span className="text-red-600">*</span>
        </label>
        <input
          id="full_name"
          className="field-input"
          value={values.full_name}
          aria-invalid={errors.full_name ? "true" : undefined}
          aria-describedby={errors.full_name ? "full_name-error" : undefined}
          onChange={(event) => setField("full_name", event.target.value)}
        />
        {errors.full_name ? (
          <p id="full_name-error" className="field-error">{errors.full_name}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          type="email"
          className="field-input"
          value={values.email}
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          onChange={(event) => setField("email", event.target.value)}
        />
        {errors.email ? (
          <p id="email-error" className="field-error">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="phone" className="field-label">
          Teléfono <span className="text-red-600">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          className="field-input"
          value={values.phone}
          aria-invalid={errors.phone ? "true" : undefined}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          onChange={(event) => setField("phone", event.target.value)}
        />
        {errors.phone ? (
          <p id="phone-error" className="field-error">{errors.phone}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="position" className="field-label">
          Puesto <span className="text-red-600">*</span>
        </label>
        <input
          id="position"
          className="field-input"
          value={values.position}
          aria-invalid={errors.position ? "true" : undefined}
          aria-describedby={errors.position ? "position-error" : undefined}
          onChange={(event) => setField("position", event.target.value)}
        />
        {errors.position ? (
          <p id="position-error" className="field-error">{errors.position}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="experience_years" className="field-label">
          Años de experiencia <span className="text-red-600">*</span>
        </label>
        <input
          id="experience_years"
          type="number"
          min={0}
          step={1}
          className="field-input"
          value={values.experience_years}
          aria-invalid={errors.experience_years ? "true" : undefined}
          aria-describedby={errors.experience_years ? "experience_years-error" : undefined}
          onChange={(event) => setField("experience_years", event.target.value)}
        />
        {errors.experience_years ? (
          <p id="experience_years-error" className="field-error">{errors.experience_years}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="linkedin_url" className="field-label">
          LinkedIn (opcional)
        </label>
        <input
          id="linkedin_url"
          type="url"
          className="field-input"
          placeholder="https://linkedin.com/in/…"
          value={values.linkedin_url}
          onChange={(event) => setField("linkedin_url", event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="cv_url" className="field-label">
          Enlace al CV (opcional)
        </label>
        <input
          id="cv_url"
          type="url"
          className="field-input"
          placeholder="https://…"
          value={values.cv_url}
          onChange={(event) => setField("cv_url", event.target.value)}
        />
      </div>

      {submitError ? <FeedbackMessage kind="error" message={submitError} /> : null}

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}
