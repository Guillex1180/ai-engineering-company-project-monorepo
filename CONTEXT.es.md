# CONTEXT.md — TrackFlow

## Hito 1: Sitio Web Público de tu Empresa

*These instructions are [available in English](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/01-web-fundamentals/CONTEXT-trackflow.en.md).*

> Este documento describe tu empresa y la situación concreta para la que estás construyendo este hito. Léelo completo antes de escribir ningún código. Todo lo que construyas debe reflejar este contexto.

---

## Tu empresa

**TrackFlow** es una empresa de gestión de almacenes y entregas de última milla fundada en 2009 en Los Ángeles, Estados Unidos. Opera en dos mercados —Estados Unidos (Los Ángeles) y España (Zaragoza)— y ofrece tres servicios: gestión de almacenes para marcas de e-commerce, entregas de última milla (el último tramo desde el almacén hasta el cliente final), y logística inversa (devoluciones y reacondicionamiento de productos). Tiene aproximadamente 130 empleados y genera alrededor de 9 millones de euros en facturación anual. Sus clientes son marcas medianas de moda, electrónica y cosmética que venden en línea.

---

## Tu departamento y el problema que debes resolver

Trabajas en la unidad **TrackFlow Tech**, reportando directamente al CTO Andrés Kim. El sitio web corporativo actual de TrackFlow fue construido hace años por una agencia externa y está completamente desactualizado. No refleja que la empresa opera en dos países, no explica claramente los servicios, y no hay forma de que empresas interesadas soliciten información de manera estructurada. Miguel Torres (Director Comercial) necesita un sitio web profesional que presente los servicios de TrackFlow y capture leads de empresas potenciales que quieran externalizar su logística.

---

## Tu stakeholder

**Miguel Torres**, Director Comercial

> Hola,
>
> Necesitamos un nuevo sitio web que presente TrackFlow como lo que somos: un operador logístico serio con presencia en Estados Unidos y España. Debe explicar nuestros tres servicios principales: gestión de almacenes, última milla, y logística inversa. También necesito una página con un formulario para que empresas interesadas puedan solicitar información. Actualmente nos llegan consultas muy vagas por email y perdemos mucho tiempo calificando si son clientes reales o no. Quiero capturar: datos de la empresa, tipo de producto que manejan, volumen mensual estimado de envíos, países donde operan, y qué servicios les interesan. El sitio debe ser responsive, accesible, y optimizado para SEO. Usa Tailwind y asegúrate de que el formulario tenga validación completa.

---

## Alcance de idioma

- El soporte multiidioma es **opcional pero altamente recomendado** por la operación de TrackFlow en Estados Unidos y España.
- Debes escoger un **idioma base** para toda la experiencia del sitio y del formulario.
- Si implementas un segundo idioma, trátalo como una mejora (sin reducir la calidad/completitud del idioma base).

## Contenido de la landing page

Tu landing page debe incluir las siguientes secciones, en este orden:

### Header

- Logo o nombre "TrackFlow"
- Navegación: Inicio | Servicios | Cobertura | Contacto

### Hero

- **Titular:** "Logística que escala con tu e-commerce"
- **Subtítulo:** "Gestión de almacenes, entregas de última milla y logística inversa en Estados Unidos y España. Más de 15 años ayudando a marcas de moda, electrónica y cosmética a crecer sin preocuparse por la operación."
- **Call to action:** Botón "Solicitar información" que enlace al formulario

### Servicios (3 columnas)

1. **Gestión de Almacenes**
   - Almacenamiento, picking y packing
   - Inventario en tiempo real
   - Operamos almacenes en Los Ángeles y Zaragoza
2. **Entregas de Última Milla**
   - Red de carriers certificados en ambos países
   - Seguimiento unificado de envíos
   - Gestión de incidencias y devoluciones
3. **Logística Inversa**
   - Gestión completa de devoluciones
   - Inspección y reacondicionamiento
   - Integración con tu plataforma de ventas

### Cobertura (2 columnas)

- **Estados Unidos**
  - Almacén en Los Ángeles
  - Cobertura nacional
  - Carriers: UPS, FedEx, DHL
- **España**
  - Almacén en Zaragoza
  - Cobertura peninsular e islas
  - Carriers: MRW, SEUR, DHL

### Por qué TrackFlow (4 beneficios)

- **Operación binacional:** El único operador con infraestructura propia en Estados Unidos y España
- **+130 profesionales** dedicados a tu logística
- **Tecnología propia** para visibilidad total de tu inventario
- **Especialización e-commerce** en moda, electrónica y cosmética

### Contacto

- Email: [comercial@trackflow.com](mailto:comercial@trackflow.com)
- Los Ángeles: +1 213 555 0147
- Zaragoza: +34 976 123 456

### Footer

- © 2025 TrackFlow. Todos los derechos reservados.
- LinkedIn

---

## Campos del formulario de solicitud de información

Tu formulario debe capturar la siguiente información:

| Campo                                     | Tipo     | Validación                                               | Obligatorio |
| ----------------------------------------- | -------- | -------------------------------------------------------- | ----------- |
| **Nombre de la empresa**                  | text     | Mínimo 2 caracteres                                      | Sí          |
| **Persona de contacto**                   | text     | Mínimo 2 palabras (nombre y apellido)                    | Sí          |
| **Email corporativo**                     | email    | Formato válido de email                                  | Sí          |
| **Teléfono**                              | tel      | Formato: +[código país] [número]                         | Sí          |
| **Sitio web de la empresa**               | url      | Formato URL válido                                       | No          |
| **País de operación principal**           | select   | Estados Unidos / España / Ambos / Otro                   | Sí          |
| **Tipo de producto**                      | select   | Moda / Electrónica / Cosmética / Alimentación / Otro     | Sí          |
| **Volumen mensual estimado de envíos**    | select   | 0-100 / 101-500 / 501-2000 / 2000+ / No estoy seguro     | Sí          |
| **Servicios de interés**                  | checkbox | Almacenaje / Última milla / Logística inversa (múltiple) | Sí          |
| **¿Actualmente trabajas con otro 3PL?**   | radio    | Sí / No / Estoy evaluando opciones                       | Sí          |
| **Comentarios o necesidades específicas** | textarea | Máximo 500 caracteres                                    | No          |
| **Acepto política de privacidad**         | checkbox | Debe estar marcado para enviar                           | Sí          |

---

## Validaciones específicas

1. **Nombre de empresa:** Mínimo 2 caracteres
2. **Persona de contacto:** Debe contener al menos nombre y apellido
3. **Email:** Debe ser formato válido (contener @ y dominio)
4. **Teléfono:** Debe comenzar con + seguido del código de país
5. **Sitio web:** Si se proporciona, debe ser URL válida (comenzar con http\:// o https\://)
6. **Servicios de interés:** Al menos uno debe estar seleccionado
7. **Comentarios:** Limitar a 500 caracteres con contador visible
8. **Política de privacidad:** El checkbox debe estar marcado para poder enviar

---

## Mensajes de error esperados

Cuando un campo no cumpla la validación, muestra estos mensajes específicos:

- **Nombre de empresa:** "El nombre de la empresa debe tener al menos 2 caracteres"
- **Persona de contacto:** "Ingresa nombre y apellido del contacto"
- **Email:** "Ingresa un email corporativo válido (ejemplo: [nombre@empresa.com](mailto:nombre@empresa.com))"
- **Teléfono:** "El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)"
- **Sitio web:** "Si incluyes sitio web, debe ser una URL válida"
- **País:** "Selecciona el país de operación principal"
- **Tipo de producto:** "Selecciona el tipo de producto que manejas"
- **Volumen mensual:** "Selecciona el volumen mensual estimado"
- **Servicios de interés:** "Selecciona al menos un servicio de interés"
- **3PL actual:** "Indica si actualmente trabajas con otro proveedor logístico"
- **Comentarios:** "Los comentarios no pueden exceder 500 caracteres (quedan X)"
- **Política de privacidad:** "Debes aceptar la política de privacidad para continuar"

---

## Mensaje de éxito

Cuando el formulario se valide correctamente (simular envío), mostrar:

> **¡Gracias por tu interés en TrackFlow!**
>
> Hemos recibido tu solicitud. Nuestro equipo comercial revisará tu información y te contactará en las próximas 24-48 horas para agendar una llamada y conocer tus necesidades logísticas en detalle.
>
> Si tienes alguna consulta urgente, escríbenos directamente a [comercial@trackflow.com](mailto:comercial@trackflow.com)

---

## Restricción específica

El formulario está diseñado para **empresas de e-commerce que buscan externalizar su logística**, no para consumidores finales que quieren rastrear un paquete o hacer una devolución. Si detectas que el volumen seleccionado es "0-100 envíos/mes" Y el campo "Tipo de producto" es relevante, incluir un mensaje de advertencia: "Para volúmenes menores a 100 envíos mensuales, nuestros servicios podrían no ser la solución más eficiente. ¿Seguro que quieres continuar?"

---

## Schema.org markup requerido

Implementa el siguiente marcado Schema.org en tu landing page:

```
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TrackFlow",
  "description": "Gestión de almacenes y entregas de última milla para e-commerce",
  "url": "https://trackflow.com",
  "foundingDate": "2009",
  "address": [
    {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressLocality": "Los Ángeles",
      "addressRegion": "California"
    },
    {
      "@type": "PostalAddress",
      "addressCountry": "ES",
      "addressLocality": "Zaragoza",
      "addressRegion": "Aragón"
    }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-213-555-0147",
    "contactType": "sales",
    "availableLanguage": ["Spanish", "English"]
  },
  "sameAs": ["https://linkedin.com/company/trackflow"],
  "areaServed": [
    {
      "@type": "Country",
      "name": "Estados Unidos"
    },
    {
      "@type": "Country",
      "name": "Spain"
    }
  ]
}
```
---

## Mejora adicional: Asistente Virtual TrackFlow

Además de los requisitos obligatorios de la landing page, implementar un **Asistente Virtual de TrackFlow** como funcionalidad adicional.

Esta mejora no sustituye el formulario de solicitud de información ni modifica los requisitos originales del proyecto. Todos los requisitos anteriores continúan siendo obligatorios.

### Acceso al asistente

- Agregar en la navegación principal una opción **"Asistente IA"**.
- Incluir un botón flotante de chat visible desde cualquier sección de la landing page.
- El acceso debe funcionar correctamente en móvil, tablet y escritorio.
- El botón y el panel deben poder utilizarse mediante teclado.

### Interfaz del asistente

Al seleccionar **"Asistente IA"**, mostrar un panel de conversación que incluya:

- Encabezado **"Asistente TrackFlow"**.
- Historial de conversación.
- Campo para escribir mensajes.
- Botón **"Enviar"**.
- Botón para cerrar el asistente.
- Indicador visual mientras el asistente procesa una respuesta.
- Mensaje inicial de bienvenida.

Mensaje inicial:

> **¡Hola! Soy el asistente virtual de TrackFlow.** Puedo ayudarte a conocer nuestros servicios y orientarte según las necesidades logísticas de tu empresa. ¿En qué puedo ayudarte?

### Objetivo del agente

El asistente debe ayudar a empresas interesadas en los servicios de TrackFlow y responder preguntas relacionadas con:

- Gestión de almacenes.
- Entregas de última milla.
- Logística inversa.
- Cobertura en Estados Unidos.
- Cobertura en España.
- Tipos de servicios disponibles.
- Proceso para solicitar información.

También podrá ayudar a identificar las necesidades del cliente mediante preguntas como:

- ¿Cuál es el nombre de tu empresa?
- ¿En qué país opera principalmente?
- ¿Qué tipo de productos maneja?
- ¿Cuál es aproximadamente su volumen mensual de envíos?
- ¿Qué servicios de TrackFlow le interesan?

### Integración con el formulario

Cuando sea posible, la información recopilada durante la conversación podrá utilizarse para facilitar el llenado del formulario de solicitud de información.

- El usuario siempre debe poder revisar y modificar los datos antes de enviar el formulario.
- El asistente nunca debe enviar el formulario automáticamente.
- La integración debe respetar todas las validaciones originales del formulario.

### Alcance de la primera versión

La arquitectura del asistente debe estar desacoplada del resto de la landing page.

En la primera versión:

- Se pueden utilizar respuestas simuladas o datos locales.
- No es obligatorio conectar un modelo de inteligencia artificial externo.
- No se deben incluir credenciales de servicios externos en el frontend.
- La arquitectura debe permitir conectar posteriormente el frontend con un backend o API de inteligencia artificial sin reconstruir la interfaz.

Arquitectura conceptual recomendada:

```text
UI del Chat
    ↓
Chat Service / Agent Service
    ↓
Mock Agent (primera versión)
    ↓
API de IA (integración futura)
```

### Comportamiento esperado de la primera versión

El Mock Agent debe ser capaz de reconocer consultas básicas relacionadas con:

1. **Gestión de almacenes** — explicar almacenamiento, picking, packing e inventario.
2. **Última milla** — explicar entregas, seguimiento y gestión de incidencias.
3. **Logística inversa** — explicar devoluciones, inspección y reacondicionamiento.
4. **Cobertura** — explicar la operación de TrackFlow en Estados Unidos y España.
5. **Solicitud de información** — orientar al usuario hacia el formulario comercial.

Cuando una pregunta quede fuera del alcance de la primera versión, mostrar un mensaje como:

> "Todavía no tengo información suficiente para responder esa consulta. Puedo ayudarte con nuestros servicios de almacenes, última milla, logística inversa, cobertura o con el proceso para solicitar información."

### Accesibilidad del asistente

El asistente debe:

- Poder utilizarse completamente mediante teclado.
- Tener labels o nombres accesibles en todos los controles.
- Mantener estados de foco visibles.
- Utilizar atributos ARIA cuando sean necesarios.
- Permitir cerrar el panel mediante teclado.
- Mantener contraste de texto adecuado.
- Anunciar nuevos mensajes del asistente mediante `aria-live`.
- Gestionar el foco de forma adecuada al abrir y cerrar el panel.
- No impedir el acceso al resto de la página cuando esté cerrado.

### Responsive design

- En escritorio, el asistente puede mostrarse como un panel flotante en una esquina de la pantalla.
- En dispositivos móviles, debe adaptarse al ancho disponible y mantener controles táctiles accesibles.
- El historial de mensajes debe permitir desplazamiento sin afectar el scroll general de la página.

### Seguridad y privacidad

Nunca almacenar o exponer en el frontend:

- API keys.
- Credenciales.
- Tokens privados.
- Secretos.
- Credenciales AWS u otros proveedores.

Cualquier integración futura con un modelo de inteligencia artificial deberá realizarse mediante un backend seguro.

El asistente no debe solicitar contraseñas, datos de tarjetas, credenciales ni información sensible que no sea necesaria para una solicitud comercial.

### Criterios de aceptación del Asistente Virtual

La mejora se considera implementada correctamente cuando:

1. Existe un acceso visible al **Asistente IA**.
2. El panel puede abrirse y cerrarse correctamente.
3. El usuario puede escribir y enviar mensajes.
4. Los mensajes aparecen en el historial de conversación.
5. El asistente ofrece respuestas simuladas sobre los servicios principales de TrackFlow.
6. Existe un estado visual de procesamiento o escritura.
7. La interfaz funciona en móvil y escritorio.
8. El asistente puede utilizarse mediante teclado.
9. Las respuestas nuevas se anuncian de manera accesible.
10. La lógica del agente está separada de la interfaz visual.
11. No existen API keys, tokens o secretos expuestos en el frontend.
12. El asistente no sustituye ni rompe el formulario original.
13. La información recopilada por el asistente puede prepararse para facilitar el formulario, pero nunca se envía automáticamente.
14. Todos los requisitos originales de TrackFlow permanecen intactos.
