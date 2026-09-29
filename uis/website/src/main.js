/**
 * TrackFlow — lógica de la landing page (formulario + navegación).
 *
 * Responsabilidades:
 *  - Menú de navegación en móvil.
 *  - Contador de caracteres del textarea de comentarios.
 *  - Advertencia especial para volumen "0-100" envíos/mes.
 *  - Validación completa del formulario (mensajes exactos de CONTEXT.es.md).
 *  - Envío SIMULADO (sin backend) y mensaje de éxito.
 *  - prefillForm(): permite que el Asistente Virtual rellene el formulario
 *    con los datos recopilados, SIN enviarlo automáticamente.
 *
 * Se exporta initLanding() y prefillForm() como módulo ES; el arranque real
 * ocurre en entry.js.
 */

const MAX_COMMENTS = 500;

/* --------------------------- Errores UI --------------------------- */
function showError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + "-error");
  const field = document.getElementById(fieldId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }
  if (field) {
    field.setAttribute("aria-invalid", "true");
  }
}

function clearError(fieldId) {
  const errorEl = document.getElementById(fieldId + "-error");
  const field = document.getElementById(fieldId);
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }
  if (field) {
    field.removeAttribute("aria-invalid");
  }
}

/* --------------------------- Validaciones --------------------------- */
function validate(form) {
  const data = new FormData(form);
  let firstInvalid = null;

  function fail(fieldId, message) {
    showError(fieldId, message);
    if (!firstInvalid) firstInvalid = document.getElementById(fieldId);
  }

  // Nombre de empresa: mínimo 2 caracteres.
  const company = (data.get("company") || "").toString().trim();
  if (company.length < 2) {
    fail("company", "El nombre de la empresa debe tener al menos 2 caracteres");
  } else {
    clearError("company");
  }

  // Persona de contacto: al menos nombre y apellido (2 palabras).
  const contact = (data.get("contact") || "").toString().trim();
  const words = contact.split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    fail("contact", "Ingresa nombre y apellido del contacto");
  } else {
    clearError("contact");
  }

  // Email: formato válido.
  const email = (data.get("email") || "").toString().trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    fail("email", "Ingresa un email corporativo válido (ejemplo: nombre@empresa.com)");
  } else {
    clearError("email");
  }

  // Teléfono: debe empezar por + seguido del código de país.
  const phone = (data.get("phone") || "").toString().trim();
  const phoneRe = /^\+\d[\d\s]{5,}$/;
  if (!phoneRe.test(phone)) {
    fail("phone", "El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)");
  } else {
    clearError("phone");
  }

  // Sitio web: opcional, pero si se da debe ser URL válida http(s)://
  const website = (data.get("website") || "").toString().trim();
  if (website !== "") {
    const urlRe = /^https?:\/\/.+\..+/i;
    if (!urlRe.test(website)) {
      fail("website", "Si incluyes sitio web, debe ser una URL válida");
    } else {
      clearError("website");
    }
  } else {
    clearError("website");
  }

  // País de operación principal.
  if (!(data.get("country") || "").toString().trim()) {
    fail("country", "Selecciona el país de operación principal");
  } else {
    clearError("country");
  }

  // Tipo de producto.
  if (!(data.get("product") || "").toString().trim()) {
    fail("product", "Selecciona el tipo de producto que manejas");
  } else {
    clearError("product");
  }

  // Volumen mensual.
  if (!(data.get("volume") || "").toString().trim()) {
    fail("volume", "Selecciona el volumen mensual estimado");
  } else {
    clearError("volume");
  }

  // Servicios de interés: al menos uno.
  const services = data.getAll("services");
  if (services.length === 0) {
    fail("services", "Selecciona al menos un servicio de interés");
  } else {
    clearError("services");
  }

  // 3PL actual.
  if (!(data.get("tpl") || "").toString().trim()) {
    fail("tpl", "Indica si actualmente trabajas con otro proveedor logístico");
  } else {
    clearError("tpl");
  }

  // Comentarios: máximo 500 caracteres.
  const commentsValue = (data.get("comments") || "").toString();
  if (commentsValue.length > MAX_COMMENTS) {
    fail("comments", "Los comentarios no pueden exceder 500 caracteres (quedan " + (MAX_COMMENTS - commentsValue.length) + ")");
  } else {
    clearError("comments");
  }

  // Política de privacidad.
  const privacy = document.getElementById("privacy");
  if (!privacy.checked) {
    fail("privacy", "Debes aceptar la política de privacidad para continuar");
  } else {
    clearError("privacy");
  }

  return firstInvalid;
}

/**
 * Prellena el formulario con datos recopilados por el Asistente Virtual.
 * NUNCA envía el formulario: solo rellena campos para que el usuario revise.
 * @param {{company?:string,country?:string,product?:string,volume?:string,services?:string[]}} lead
 */
export function prefillForm(lead = {}) {
  if (lead.company) {
    const el = document.getElementById("company");
    if (el) el.value = lead.company;
  }
  if (lead.country) {
    const el = document.getElementById("country");
    if (el && [...el.options].some((o) => o.value === lead.country)) el.value = lead.country;
  }
  if (lead.product) {
    const el = document.getElementById("product");
    if (el && [...el.options].some((o) => o.value === lead.product)) el.value = lead.product;
  }
  if (lead.volume) {
    const el = document.getElementById("volume");
    if (el && [...el.options].some((o) => o.value === lead.volume)) {
      el.value = lead.volume;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
  if (Array.isArray(lead.services) && lead.services.length) {
    document.querySelectorAll('input[name="services"]').forEach((cb) => {
      if (lead.services.includes(cb.value)) cb.checked = true;
    });
  }
}

/* --------------------------- Inicialización --------------------------- */
export function initLanding() {
  /* Menú móvil */
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      const isMenuOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isMenuOpen));
      mobileNav.classList.toggle("hidden", isMenuOpen);
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuToggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.add("hidden");
      });
    });
  }

  const form = document.getElementById("info-form");
  if (!form) return;

  const successMessage = document.getElementById("success-message");
  const comments = document.getElementById("comments");
  const commentsCount = document.getElementById("comments-count");
  const volume = document.getElementById("volume");
  const volumeWarning = document.getElementById("volume-warning");

  /* Contador de comentarios */
  function updateCommentsCount() {
    const length = comments.value.length;
    commentsCount.textContent = String(length);
    if (length > MAX_COMMENTS) {
      showError("comments", "Los comentarios no pueden exceder 500 caracteres (quedan " + (MAX_COMMENTS - length) + ")");
    } else {
      clearError("comments");
    }
  }
  comments.addEventListener("input", updateCommentsCount);

  /* Advertencia de volumen */
  function updateVolumeWarning() {
    if (volume.value === "0-100") {
      volumeWarning.textContent =
        "Para volúmenes menores a 100 envíos mensuales, nuestros servicios podrían no ser la solución más eficiente. ¿Seguro que quieres continuar?";
      volumeWarning.classList.remove("hidden");
    } else {
      volumeWarning.textContent = "";
      volumeWarning.classList.add("hidden");
    }
  }
  volume.addEventListener("change", updateVolumeWarning);

  /* Envío simulado */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const firstInvalid = validate(form);
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    form.classList.add("hidden");
    successMessage.classList.remove("hidden");
    successMessage.setAttribute("tabindex", "-1");
    successMessage.focus();
    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  updateCommentsCount();
  updateVolumeWarning();
}
