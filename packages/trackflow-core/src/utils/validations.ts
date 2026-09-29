/**
 * Reglas de validación de negocio de TrackFlow.
 *
 * Reproducen fielmente las reglas y los mensajes de error definidos en
 * CONTEXT.es.md para el formulario de solicitud de información, más la
 * "restricción específica" de negocio (advertencia para volúmenes 0-100).
 *
 * Funciones puras: reciben datos por parámetros, no usan variables globales,
 * no mutan el objeto original y devuelven resultados tipados. Reutilizables
 * desde el formulario, un backend, el agente o pruebas.
 */
import type { InformationRequest } from "../types/models.js";

/** Error de validación asociado a un campo. */
export interface FieldError {
  field: keyof InformationRequest;
  message: string;
}

/** Resultado tipado de una validación completa. */
export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
  /** Advertencias no bloqueantes (p. ej. la restricción especial de volumen). */
  warnings: string[];
}

/** Máximo de caracteres para el campo comentarios (de CONTEXT.es.md). */
export const MAX_COMMENTS_LENGTH = 500;

/* ------------------------- Validadores de campo (puros) ------------------------- */

/** Nombre de empresa: mínimo 2 caracteres. */
export function validateCompanyName(companyName: string): string | null {
  return companyName.trim().length >= 2
    ? null
    : "El nombre de la empresa debe tener al menos 2 caracteres";
}

/** Persona de contacto: al menos nombre y apellido (2 palabras). */
export function validateContactPerson(contactPerson: string): string | null {
  const words = contactPerson.trim().split(/\s+/).filter(Boolean);
  return words.length >= 2 ? null : "Ingresa nombre y apellido del contacto";
}

/** Email: formato válido (contiene @ y dominio). */
export function validateEmail(email: string): string | null {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.trim())
    ? null
    : "Ingresa un email corporativo válido (ejemplo: nombre@empresa.com)";
}

/** Teléfono: debe comenzar con + seguido del código de país. */
export function validatePhone(phone: string): string | null {
  const phonePattern = /^\+\d[\d\s]{5,}$/;
  return phonePattern.test(phone.trim())
    ? null
    : "El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)";
}

/** Sitio web: opcional; si se proporciona debe ser URL http(s) válida. */
export function validateWebsite(website: string | undefined): string | null {
  if (website === undefined || website.trim() === "") {
    return null;
  }
  const urlPattern = /^https?:\/\/.+\..+/i;
  return urlPattern.test(website.trim())
    ? null
    : "Si incluyes sitio web, debe ser una URL válida";
}

/** País de operación: debe estar seleccionado. */
export function validateCountry(country: string): string | null {
  return country.trim() !== "" ? null : "Selecciona el país de operación principal";
}

/** Tipo de producto: debe estar seleccionado. */
export function validateProductType(productType: string): string | null {
  return productType.trim() !== ""
    ? null
    : "Selecciona el tipo de producto que manejas";
}

/** Volumen mensual: debe estar seleccionado. */
export function validateMonthlyVolume(monthlyVolume: string): string | null {
  return monthlyVolume.trim() !== "" ? null : "Selecciona el volumen mensual estimado";
}

/** Servicios de interés: al menos uno seleccionado. */
export function validateServices(services: readonly string[]): string | null {
  return services.length > 0 ? null : "Selecciona al menos un servicio de interés";
}

/** 3PL actual: debe indicarse. */
export function validateThirdPartyLogistics(status: string): string | null {
  return status.trim() !== ""
    ? null
    : "Indica si actualmente trabajas con otro proveedor logístico";
}

/** Comentarios: opcional; máximo 500 caracteres, con conteo restante. */
export function validateComments(comments: string | undefined): string | null {
  const value = comments ?? "";
  if (value.length <= MAX_COMMENTS_LENGTH) {
    return null;
  }
  const remaining = MAX_COMMENTS_LENGTH - value.length;
  return `Los comentarios no pueden exceder 500 caracteres (quedan ${remaining})`;
}

/** Política de privacidad: debe estar aceptada. */
export function validatePrivacy(accepted: boolean): string | null {
  return accepted ? null : "Debes aceptar la política de privacidad para continuar";
}

/* ------------------------- Restricción especial de negocio ------------------------- */

/**
 * Restricción específica de CONTEXT.es.md: si el volumen es "0-100 envíos/mes"
 * el servicio podría no ser eficiente. Devuelve una advertencia (no bloquea).
 */
export function volumeWarning(request: Pick<InformationRequest, "monthlyVolume">): string | null {
  return request.monthlyVolume === "0-100"
    ? "Para volúmenes menores a 100 envíos mensuales, nuestros servicios podrían no ser la solución más eficiente. ¿Seguro que quieres continuar?"
    : null;
}

/* ------------------------- Validación completa ------------------------- */

/**
 * Valida una solicitud completa. No muta la entrada.
 * @returns resultado con validez, errores por campo y advertencias.
 */
export function validateInformationRequest(
  request: InformationRequest
): ValidationResult {
  const errors: FieldError[] = [];

  const push = (field: keyof InformationRequest, message: string | null): void => {
    if (message !== null) {
      errors.push({ field, message });
    }
  };

  push("companyName", validateCompanyName(request.companyName));
  push("contactPerson", validateContactPerson(request.contactPerson));
  push("email", validateEmail(request.email));
  push("phone", validatePhone(request.phone));
  push("website", validateWebsite(request.website));
  push("country", validateCountry(request.country));
  push("productType", validateProductType(request.productType));
  push("monthlyVolume", validateMonthlyVolume(request.monthlyVolume));
  push("services", validateServices(request.services));
  push("currentThirdPartyLogistics", validateThirdPartyLogistics(request.currentThirdPartyLogistics));
  push("comments", validateComments(request.comments));
  push("privacyAccepted", validatePrivacy(request.privacyAccepted));

  const warnings: string[] = [];
  const warning = volumeWarning(request);
  if (warning !== null) {
    warnings.push(warning);
  }

  return { valid: errors.length === 0, errors, warnings };
}
