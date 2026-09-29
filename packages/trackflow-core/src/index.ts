/**
 * API pública de @repo/trackflow-core.
 *
 * Capa lógica reutilizable de TrackFlow. Puede consumirse desde el frontend,
 * un backend, el agente o pruebas, sin dependencias del DOM ni de servicios
 * externos.
 */
export * from "./types/models.js";
export * from "./data/samples.js";
export * from "./utils/collections.js";
export * from "./utils/search.js";
export * from "./utils/transformations.js";
export * from "./utils/validations.js";
