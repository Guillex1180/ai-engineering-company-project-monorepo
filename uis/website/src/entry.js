/**
 * Punto de arranque del frontend de TrackFlow.
 *
 * Conecta la landing (formulario) con el Asistente Virtual, manteniendo cada
 * pieza desacoplada:
 *   - initLanding(): lógica del formulario y navegación.
 *   - initChat({ onPrefillForm }): asistente; al prellenar, delega en prefillForm().
 *
 * El chat entrega los datos a la landing mediante el callback onPrefillForm,
 * que NUNCA envía el formulario (solo rellena campos para revisión del usuario).
 */
import { initLanding, prefillForm } from "./main.js";
import { initChat } from "./chat/chat-ui.js";

function boot() {
  initLanding();
  initChat({ onPrefillForm: prefillForm });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
