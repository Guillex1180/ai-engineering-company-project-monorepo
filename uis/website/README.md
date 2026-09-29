# TrackFlow — Sitio web público (Hito 1 + Asistente Virtual)

Landing page corporativa de **TrackFlow** con formulario de solicitud de información
y un **Asistente Virtual** (chat con Mock Agent local).
Implementa el Hito 1 y la mejora del Asistente descritos en [`CONTEXT.es.md`](../../CONTEXT.es.md).

## Qué incluye

### Landing (Hito 1)

- **Header** con logo y navegación (Inicio · Servicios · Cobertura · Contacto · **Asistente IA**), con menú responsive en móvil.
- **Hero** con titular, subtítulo y CTA "Solicitar información".
- **Servicios** en 3 columnas: Gestión de Almacenes, Entregas de Última Milla, Logística Inversa.
- **Cobertura** en 2 columnas: Estados Unidos y España.
- **Por qué TrackFlow** con los 4 beneficios.
- **Formulario** de solicitud de información con los 12 campos, validación completa,
  mensajes de error exactos, contador de 500 caracteres, advertencia para volumen "0-100",
  **envío simulado** (sin backend) y mensaje de éxito.
- **Contacto** (email + teléfonos de Los Ángeles y Zaragoza).
- **Footer** con copyright y LinkedIn.
- SEO básico (meta tags, Open Graph, canonical) y marcado **Schema.org `Organization`**.
- Diseño **responsive mobile-first**, HTML semántico, navegación por teclado, labels asociados
  y estados de foco visibles.

### Asistente Virtual TrackFlow

- Acceso visible **"Asistente IA"** en la navegación (escritorio y móvil) + **botón flotante** en todas las secciones.
- Panel de conversación con: título "Asistente TrackFlow", mensaje de bienvenida, historial,
  campo de texto, botón Enviar, botón Cerrar e indicador de "escribiendo".
- **Mock Agent local** (sin API externa) que responde sobre almacenes, última milla, logística
  inversa, cobertura, servicios y proceso de solicitud, con mensaje de fallback fuera de alcance.
- Recopila datos del lead durante la conversación (empresa, país, producto, volumen, servicios)
  y permite **prellenar el formulario** con un botón. Nunca envía el formulario automáticamente.
- Accesible: `role="dialog"` + `aria-modal`, gestión de foco al abrir/cerrar, trampa de foco,
  cierre con **ESC**, `aria-live` para anunciar mensajes nuevos, labels accesibles y foco visible.

## Arquitectura del asistente

La interfaz está **desacoplada** de la lógica del agente:

```text
Chat UI (src/chat/chat-ui.js)
    ↓
Agent Service (src/agent/agent-service.js)   ← mantiene historial y datos del lead
    ↓
Mock Agent (src/agent/mock-agent.js)          ← intención + respuestas (SOLO datos de TrackFlow)
    ↓
(futura API de IA)                            ← se conecta con setBackend(), sin tocar la UI
```

- La UI **solo** habla con el Agent Service; nunca con el Mock directamente.
- Para conectar Amazon Bedrock u otra API en el futuro, se implementa un backend con la misma
  interfaz (`async respond({ message, lead }) => { reply, lead, matched }`) y se inyecta con
  `agentService.setBackend(...)`. La interfaz visual no cambia.
- **Seguridad:** el frontend no contiene claves, tokens ni credenciales. Una integración real
  con un modelo de IA debe hacerse a través de un backend seguro que custodie los secretos.

## Tecnología

- HTML estático + **Tailwind CSS** (compilado con Tailwind CLI).
- JavaScript vanilla en **módulos ES** (`type="module"`).
- Sin backend: envío del formulario y respuestas del asistente **simulados** en el cliente.

## Cómo ejecutar

Requisitos: Node.js y npm.

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar Tailwind (genera dist/output.css)
npm run build
# o, en modo desarrollo con recompilación automática:
npm run dev

# 3. Servir la página de forma estática (puerto 3000)
npm run serve
```

Luego abre <http://localhost:3000>.

> `dist/output.css` se genera con el build. Si abres `index.html` sin compilar, no verás estilos.
> El sitio usa módulos ES, por lo que debe servirse por HTTP (no `file://`).

## Cómo probar

### Formulario

1. Baja a la sección "Solicita información".
2. Envía vacío para ver las validaciones y los mensajes de error.
3. Elige volumen "0-100" para ver la advertencia especial.
4. Escribe en comentarios para ver el contador (máx. 500).
5. Rellena todo correctamente + acepta privacidad → aparece el mensaje de éxito.

### Asistente

1. Pulsa "Asistente IA" (nav o botón flotante).
2. Pregunta por "almacenes", "última milla", "logística inversa", "cobertura en Estados Unidos", "servicios" o "solicitar información".
3. Escribe algo fuera de alcance para ver el mensaje de fallback.
4. Da datos ("mi empresa es X, vendo moda, 800 envíos al mes en España, me interesa almacenaje")
   y pulsa "Rellenar el formulario con mis datos": revisa el formulario prellenado y envíalo tú.
5. Prueba teclado: Tab para navegar, Enter para enviar, ESC para cerrar.

## Estructura

```text
uis/website/
├── index.html                  # Landing + Schema.org + formulario + panel del chat
├── src/
│   ├── entry.js                # Arranque: conecta landing y asistente (prefill)
│   ├── main.js                 # Formulario: validación, contador, envío simulado, prefillForm()
│   ├── input.css               # Tailwind + estilos de foco/accesibilidad + indicador de chat
│   ├── agent/
│   │   ├── knowledge.js        # Datos de TrackFlow (de CONTEXT.es.md) + mensajes
│   │   ├── mock-agent.js       # Mock Agent: intención, respuestas, extracción de lead
│   │   └── agent-service.js    # Capa desacoplada UI ↔ agente (historial + lead)
│   └── chat/
│       └── chat-ui.js          # Panel del chat: render, foco, ESC, aria-live
├── dist/output.css             # CSS compilado (generado por el build)
├── tailwind.config.cjs
├── postcss.config.cjs
└── package.json
```
