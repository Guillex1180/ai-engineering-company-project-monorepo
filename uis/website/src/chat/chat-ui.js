/**
 * Chat UI — interfaz del Asistente Virtual TrackFlow.
 *
 * Responsabilidad ÚNICA: presentar el panel de chat y traducir interacción del
 * usuario en llamadas al Agent Service. NO contiene lógica de negocio del
 * agente (esa vive en agent-service.js -> mock-agent.js).
 *
 * Accesibilidad: role="dialog" + aria-modal, foco gestionado al abrir/cerrar,
 * cierre con ESC, aria-live para anunciar mensajes nuevos, labels accesibles.
 */
import { AgentService } from "../agent/agent-service.js";
import { WELCOME_MESSAGE } from "../agent/knowledge.js";

export function initChat({ onPrefillForm } = {}) {
  const service = new AgentService();

  // ---- Referencias del DOM ----
  const openButtons = document.querySelectorAll("[data-chat-open]");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const log = document.getElementById("chat-log");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const typing = document.getElementById("chat-typing");
  const prefillBtn = document.getElementById("chat-prefill");
  if (!panel || !form || !input || !log) return;

  let lastFocusedBeforeOpen = null;
  let welcomed = false;

  // ---- Render de mensajes ----
  function appendMessage(role, text) {
    const wrap = document.createElement("div");
    wrap.className =
      role === "user"
        ? "flex justify-end"
        : "flex justify-start";

    const bubble = document.createElement("div");
    bubble.className =
      role === "user"
        ? "max-w-[80%] rounded-2xl rounded-br-sm bg-brand-600 px-4 py-2 text-sm text-white"
        : "max-w-[80%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2 text-sm text-slate-800";
    bubble.textContent = text;

    // Prefijo accesible para lectores de pantalla.
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = role === "user" ? "Tú: " : "Asistente TrackFlow: ";
    bubble.prepend(sr);

    wrap.appendChild(bubble);
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }

  function setProcessing(isProcessing) {
    typing.classList.toggle("hidden", !isProcessing);
    input.disabled = isProcessing;
    form.querySelector('button[type="submit"]').disabled = isProcessing;
  }

  // ---- Apertura / cierre con gestión de foco ----
  function openPanel() {
    lastFocusedBeforeOpen = document.activeElement;
    panel.classList.remove("hidden");
    openButtons.forEach((b) => b.setAttribute("aria-expanded", "true"));

    if (!welcomed) {
      appendMessage("assistant", WELCOME_MESSAGE);
      welcomed = true;
    }
    // Foco al campo de escritura para uso inmediato con teclado.
    window.requestAnimationFrame(() => input.focus());
  }

  function closePanel() {
    panel.classList.add("hidden");
    openButtons.forEach((b) => b.setAttribute("aria-expanded", "false"));
    // Devuelve el foco al elemento que abrió el panel.
    if (lastFocusedBeforeOpen && typeof lastFocusedBeforeOpen.focus === "function") {
      lastFocusedBeforeOpen.focus();
    }
  }

  function isOpen() {
    return !panel.classList.contains("hidden");
  }

  // ---- Trampa de foco dentro del panel (accesibilidad de diálogo) ----
  function focusablesInPanel() {
    return Array.from(
      panel.querySelectorAll(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.disabled && el.offsetParent !== null);
  }

  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
      return;
    }
    if (event.key === "Tab") {
      const focusables = focusablesInPanel();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // ---- Eventos ----
  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => (isOpen() ? closePanel() : openPanel()));
  });
  closeBtn.addEventListener("click", closePanel);

  // Enter envía; Shift+Enter inserta salto de línea.
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage("user", text);
    input.value = "";
    setProcessing(true);

    try {
      // Pequeña latencia simulada para que el indicador sea perceptible.
      const [{ reply }] = await Promise.all([
        service.sendMessage(text),
        new Promise((r) => setTimeout(r, 400))
      ]);
      appendMessage("assistant", reply);
      updatePrefillAvailability();
    } catch (err) {
      appendMessage(
        "assistant",
        "Lo siento, ha ocurrido un problema al procesar tu mensaje. Inténtalo de nuevo."
      );
    } finally {
      setProcessing(false);
      input.focus();
    }
  });

  // ---- Prellenado del formulario (nunca envío automático) ----
  function hasLeadData() {
    const lead = service.getLeadData();
    return Boolean(lead.company || lead.country || lead.product || lead.volume || (lead.services && lead.services.length));
  }

  function updatePrefillAvailability() {
    if (!prefillBtn) return;
    prefillBtn.classList.toggle("hidden", !hasLeadData());
  }

  if (prefillBtn) {
    prefillBtn.addEventListener("click", () => {
      const lead = service.getLeadData();
      if (typeof onPrefillForm === "function") {
        onPrefillForm(lead);
      }
      appendMessage(
        "assistant",
        "He llevado tus datos al formulario de solicitud. Revísalos, complétalos si falta algo y pulsa Enviar cuando quieras. No enviaré nada por ti."
      );
      closePanel();
      const formSection = document.getElementById("formulario");
      if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
    });
  }
}
