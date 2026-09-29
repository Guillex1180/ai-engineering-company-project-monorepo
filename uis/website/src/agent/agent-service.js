/**
 * Agent Service — capa intermedia entre la UI del chat y el agente.
 *
 *   Chat UI  ->  Agent Service  ->  Mock Agent  ->  (futura API de IA)
 *
 * La UI SOLO habla con este servicio; nunca con el Mock Agent directamente.
 * Aquí vive el estado de la conversación (historial + datos del lead), de modo
 * que sustituir el Mock por Amazon Bedrock u otra API es cambiar únicamente el
 * "backend" inyectado, sin tocar la interfaz.
 *
 * Seguridad: este archivo corre en el frontend y NO contiene ni debe contener
 * claves, tokens ni credenciales. Una integración real con un modelo de IA se
 * hará contra un backend propio que custodie los secretos.
 */
import * as mockAgent from "./mock-agent.js";

export class AgentService {
  /**
   * @param {object} [backend] Implementación del agente. Por defecto, el Mock.
   *   Debe exponer: async respond({ message, lead }) => { reply, lead, matched }.
   */
  constructor(backend = mockAgent) {
    this.backend = backend;
    this.history = []; // [{ role: 'user' | 'assistant', text }]
    this.lead = {}; // datos acumulados para prellenar el formulario
  }

  /**
   * Permite conmutar de backend en el futuro (p. ej. un cliente de Bedrock)
   * sin reconstruir la UI ni perder el estado de la conversación.
   */
  setBackend(backend) {
    this.backend = backend;
  }

  getHistory() {
    return this.history.slice();
  }

  /** Datos del lead recopilados hasta ahora (copia inmutable). */
  getLeadData() {
    return { ...this.lead, services: this.lead.services ? [...this.lead.services] : undefined };
  }

  /**
   * Envía un mensaje del usuario y devuelve la respuesta del asistente.
   * @param {string} message
   * @returns {Promise<{reply: string, lead: object}>}
   */
  async sendMessage(message) {
    const text = (message || "").trim();
    if (!text) {
      return { reply: "", lead: this.getLeadData() };
    }

    this.history.push({ role: "user", text });

    const result = await this.backend.respond({ message: text, lead: this.lead });

    this.lead = result.lead || this.lead;
    this.history.push({ role: "assistant", text: result.reply });

    return { reply: result.reply, lead: this.getLeadData() };
  }
}
