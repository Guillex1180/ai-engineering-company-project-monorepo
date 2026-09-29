# TrackFlow Project Context Rule

## Scope

**ALWAYS** — esta regla aplica a todas las sesiones y a cualquier cambio de
código en este repositorio, sin excepción.

## Regla

Antes de escribir código, el agente de desarrollo debe:

1. Leer `CONTEXT.md`.
2. Leer `memory-bank/projectbrief.md`.
3. Leer `memory-bank/techContext.md`.
4. Leer `memory-bank/progress.md`.
5. Leer el `README.md` correspondiente al área afectada.
6. Identificar la aplicación o servicio afectado antes de tocar archivos.
7. No crear carpetas duplicadas; reutilizar la estructura existente.
8. Respetar las convenciones del monorepo (ubicación por responsabilidad,
   READMEs por app/paquete, nombres, idioma base español).
9. Mantener la separación entre `uis/website`, `uis/backoffice`, `services/`,
   `/agents`, `/skills` y `.agents/`.
10. No inventar requisitos empresariales: solo lo respaldado por `CONTEXT.md`.
11. Actualizar el Memory Bank (`progress.md` y, si aplica, `techContext.md`)
    cuando una decisión o funcionalidad cambie.

## Aplicación

Si alguno de estos pasos no puede cumplirse (p. ej. falta un README o el contexto
es ambiguo), el agente debe detenerse y pedir aclaración en lugar de asumir.
