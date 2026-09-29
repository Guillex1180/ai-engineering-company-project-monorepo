# Asistente IA — TrackFlow

Documento descriptivo del **Asistente Virtual de TrackFlow** integrado en el sitio
web público (`uis/website`). Explica qué hace, cuál es su función y cómo está
construido.

---

## 1. Qué es

El "Asistente IA" es un **chat conversacional** embebido en la landing pública de
TrackFlow. Es accesible desde:

- El enlace **"Asistente IA"** de la navegación (escritorio y móvil).
- Un **botón flotante** de chat visible en cualquier sección de la página.

Al abrirlo se muestra un panel de conversación titulado **"Asistente TrackFlow"** con
mensaje de bienvenida, historial, campo de escritura, botón Enviar, botón Cerrar e
indicador de "escribiendo".

---

## 2. Cuál es su función (para qué sirve)

Ayudar a **empresas de e-commerce interesadas** en TrackFlow a:

1. **Conocer los servicios** de la empresa y resolver dudas frecuentes, respondiendo
   sobre:
   - Gestión de almacenes (almacenamiento, picking, packing, inventario).
   - Entregas de última milla (carriers, seguimiento, incidencias).
   - Logística inversa (devoluciones, inspección, reacondicionamiento).
   - Cobertura en Estados Unidos y en España.
   - Los servicios disponibles y el proceso para solicitar información.

2. **Orientar y calificar el lead**: mientras conversa, va preguntando y capturando
   datos útiles del cliente potencial:
   - Nombre de la empresa
   - País de operación
   - Tipo de producto
   - Volumen mensual de envíos
   - Servicios de interés

3. **Facilitar el formulario**: cuando ha recopilado datos, ofrece un botón para
   **prellenar el formulario de solicitud** con esa información. El usuario siempre
   revisa y pulsa Enviar; **el asistente nunca envía el formulario por su cuenta**.

Si le preguntan algo fuera de su alcance, responde con un mensaje de fallback que
reconduce hacia los temas que sí domina (servicios, cobertura, solicitud de info).

---

## 3. Alcance de esta versión (importante)

- Es una **primera versión con un "Mock Agent" local y determinista**: responde a
  partir de una base de conocimiento con la información de TrackFlow, **sin conectar
  ninguna IA externa** (no usa OpenAI, Bedrock, Textract ni APIs de terceros).
- El procesamiento ocurre **en el navegador**; no se envían datos a servicios externos.
- **No contiene claves, tokens ni credenciales.** Cualquier integración futura con un
  modelo de IA real debería hacerse a través de un backend seguro.

---

## 4. Arquitectura

La interfaz está **desacoplada** de la lógica del agente:

```text
Chat UI  ──►  Agent Service  ──►  Mock Agent  ──►  (futura API de IA)
```

- La UI **solo** habla con el Agent Service; nunca con el Mock directamente.
- Para conectar en el futuro Amazon Bedrock u otra API, se implementa un backend con
  la misma interfaz (`async respond({ message, lead }) => { reply, lead, matched }`) y
  se inyecta con `agentService.setBackend(...)`. **La interfaz visual no cambia.**

### Archivos (en `uis/website/`)

| Archivo | Rol |
| ------- | --- |
| `src/chat/chat-ui.js` | **Chat UI.** Presenta el panel, renderiza mensajes, gestiona apertura/cierre, foco, indicador de proceso y el botón de prellenado. No contiene lógica de negocio. |
| `src/agent/agent-service.js` | **Agent Service.** Capa intermedia; mantiene el historial y los datos del lead, y delega en el backend (por defecto el Mock). Permite cambiar de backend sin tocar la UI. |
| `src/agent/mock-agent.js` | **Mock Agent.** Detecta la intención del mensaje, elige la respuesta y extrae datos del lead. Solo usa información de TrackFlow. |
| `src/agent/knowledge.js` | **Base de conocimiento.** Textos, mensaje de bienvenida, mensaje de fallback y opciones válidas del formulario (datos de TrackFlow). |
| `src/main.js` | Expone `prefillForm(lead)` para rellenar el formulario con los datos que entrega el asistente (sin enviarlo). |
| `src/entry.js` | Arranque: conecta la landing y el asistente (pasa `prefillForm` como callback de prellenado). |

---

## 5. Cómo funciona el Mock Agent (detalle)

1. **Normaliza** el texto del usuario (minúsculas, sin acentos).
2. **Detecta la intención** con reglas de palabras clave, evaluadas de la más
   específica a la más general (cobertura US/ES, cobertura general, almacenes, última
   milla, logística inversa, solicitud, "por qué TrackFlow", servicios, saludo).
3. **Extrae datos del lead** del mensaje y los mapea a valores válidos del formulario:
   - País (Estados Unidos / España / Ambos).
   - Tipo de producto (Moda / Electrónica / Cosmética / Alimentación).
   - Volumen mensual: si detecta un número de envíos, lo asigna a un tramo
     (`0-100`, `101-500`, `501-2000`, `2000+`); también reconoce el tramo escrito.
   - Servicios de interés (Almacenaje / Última milla / Logística inversa).
   - Nombre de empresa (patrones como "mi empresa es…", "somos…").
4. **Acumula** el lead entre turnos (los servicios se unen sin duplicar).
5. **Responde**: si hay intención temática, devuelve el texto de conocimiento; si solo
   capturó datos, confirma ("Anotado, gracias por el dato."); si nada aplica, usa el
   mensaje de fallback. Cuando corresponde, añade una pregunta para completar el
   siguiente dato que falte del lead.

---

## 6. Integración con el formulario

- El Chat UI muestra el botón **"Rellenar el formulario con mis datos"** cuando ya hay
  algún dato del lead capturado.
- Al pulsarlo, llama a `prefillForm(lead)` (en `src/main.js`), que rellena los campos
  correspondientes del formulario de solicitud y desplaza la página hasta él.
- Respeta **todas las validaciones** originales del formulario y **no** lo envía: el
  usuario revisa, completa lo que falte y pulsa Enviar manualmente.

---

## 7. Accesibilidad

- Panel como `role="dialog"` con `aria-modal`.
- Gestión de foco al abrir/cerrar y **trampa de foco** dentro del panel (Tab/Shift+Tab).
- Cierre con **ESC** y con el botón Cerrar.
- **Enter** envía el mensaje; **Shift+Enter** inserta salto de línea.
- Mensajes nuevos anunciados a lectores de pantalla (`aria-live`) y prefijos "Tú:" /
  "Asistente TrackFlow:" solo para lectores.
- Indicador visible de "escribiendo" mientras procesa; controles deshabilitados
  durante el envío para evitar duplicados.

---

## 8. Cómo probarlo

1. Levanta el sitio (por ejemplo con Docker: `docker compose up`, website en
   `http://localhost:3000`).
2. Abre el asistente con el enlace "Asistente IA" o el botón flotante.
3. Pregunta por almacenes, última milla, logística inversa, cobertura o "solicitar
   información".
4. Da tus datos ("mi empresa es X, vendo moda, 800 envíos al mes en España, me
   interesa almacenaje") y pulsa "Rellenar el formulario con mis datos".
5. Prueba una consulta fuera de tema para ver el mensaje de fallback.

---

_Fuente: implementación en `uis/website/src/agent/` y `uis/website/src/chat/`._
