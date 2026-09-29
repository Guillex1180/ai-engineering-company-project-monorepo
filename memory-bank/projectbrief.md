# TrackFlow — Project Brief

> Business context of TrackFlow. Sourced exclusively from `CONTEXT.md` /
> `CONTEXT.es.md`. Do not add business facts not backed by the briefing.

## Empresa

TrackFlow es una empresa de gestión de almacenes y entregas de última milla,
fundada en 2009 en Los Ángeles (Estados Unidos). Opera en dos mercados —Estados
Unidos (Los Ángeles) y España (Zaragoza)—, tiene aproximadamente 130 empleados y
factura alrededor de 9 millones de euros anuales.

## Problema que resuelve

El sitio corporativo anterior está desactualizado: no refleja la operación
binacional, no explica bien los servicios y no permite captar leads de forma
estructurada. TrackFlow necesita presentar sus servicios de forma profesional y
capturar empresas interesadas en externalizar su logística, calificándolas mejor
que las consultas vagas que llegaban por email.

## Clientes

Marcas medianas de e-commerce de **moda, electrónica y cosmética** que venden en
línea y buscan externalizar su logística.

## Servicios

1. **Gestión de almacenes** — almacenamiento, picking y packing; inventario en
   tiempo real; almacenes en Los Ángeles y Zaragoza.
2. **Entregas de última milla** — carriers certificados en ambos países;
   seguimiento unificado; gestión de incidencias y devoluciones.
3. **Logística inversa** — gestión de devoluciones; inspección y
   reacondicionamiento; integración con la plataforma de ventas del cliente.

## Mercados y cobertura

- **Estados Unidos** — almacén en Los Ángeles; cobertura nacional; carriers UPS,
  FedEx, DHL.
- **España** — almacén en Zaragoza; cobertura peninsular e islas; carriers MRW,
  SEUR, DHL.

## Objetivos del proyecto

Dentro del monorepo estamos construyendo el ecosistema de producto de TrackFlow:

- Un **website público** que presenta la empresa y capta leads mediante un
  formulario de solicitud de información.
- Un **Asistente Virtual** que orienta a empresas interesadas (Mock Agent local).
- Una **capa lógica TypeScript reutilizable** con los modelos y reglas de negocio.
- Una herramienta interna de **People & Talent** (Talent Pipeline Tracker).
- Un **backoffice interno** para el equipo operativo.
- Estructura preparada para **servicios backend** futuros bajo `services/`.

## Usuarios

- **Empresas de e-commerce interesadas** — visitantes del website que solicitan
  información o interactúan con el asistente.
- **Equipo comercial de TrackFlow** (Dir. Comercial Miguel Torres) — recibe y
  califica los leads.
- **Equipo de People & Talent** — usa el Talent Pipeline Tracker.
- **Equipo operativo interno** — usa el backoffice.

## Restricciones de negocio

- El formulario está dirigido a empresas que externalizan logística, no a
  consumidores finales. Si el volumen mensual es "0-100 envíos/mes", se muestra
  una advertencia de que el servicio podría no ser el más eficiente.
- Idioma base: español (multiidioma opcional y aditivo).
- No inventar servicios, ubicaciones ni estadísticas fuera del briefing.

## Roadmap

Componentes previstos respaldados por el contexto: website público + formulario,
Asistente Virtual (con integración futura a una API de IA), capa lógica
`@repo/trackflow-core`, Talent Pipeline Tracker, backoffice interno y servicios
backend futuros en `services/`. No se documenta roadmap adicional no respaldado
por `CONTEXT.md`.
