# AGENTS.md — TrackFlow

Protocolo obligatorio para cualquier agente de programación que trabaje en este
repositorio. Su objetivo es garantizar que todo cambio se mantenga alineado con
el contexto de TrackFlow, sea verificado y no introduzca riesgos.

---

## Inicio obligatorio de sesión

Antes de modificar cualquier archivo, el agente **debe leer**:

1. `CONTEXT.md` (briefing oficial de TrackFlow).
2. `memory-bank/projectbrief.md` (contexto de negocio).
3. `memory-bank/techContext.md` (contexto técnico y arquitectura).
4. `memory-bank/progress.md` (estado actual del proyecto).
5. El `README.md` relevante al área donde trabajará (p. ej. `uis/README.md`,
   `services/README.md`).
6. Las reglas aplicables dentro de `.agents/rules/`.

Además, debe **inspeccionar la estructura existente** antes de crear carpetas o
archivos, para no duplicar estructuras ni pisar otros hitos.

---

## Distinción de directorios (no confundir)

- `.agents/` → configuración de los agentes **de desarrollo** (reglas y skills).
- `/agents` y `/skills` → **código/producto** del monorepo.
- `/services` → servicios backend.
- `/uis/website` → website público. `/uis/backoffice` → app interna.
- `/memory-bank` → contexto persistente para agentes de desarrollo.

---

## Flujo obligatorio antes de commit

Pasos **ordenados y explícitos** (mínimo 4). No omitir ninguno:

1. **Revisar los cambios realizados** (qué archivos y por qué).
2. **Verificar alineación**: que los cambios cumplen `CONTEXT.md` y el requisito
   de la tarea actual, sin inventar requisitos de negocio.
3. **Ejecutar las verificaciones técnicas disponibles** según el proyecto
   modificado: `lint`, `typecheck`, `tests`, `build`.
4. **Corregir los errores** provocados por los cambios (sin `any` para ocultar
   errores ni desactivar ESLint para que pase).
5. **Actualizar `memory-bank/progress.md`** si cambió el estado del proyecto.
6. **Actualizar `memory-bank/techContext.md`** si hubo una decisión técnica o
   arquitectónica nueva.
7. **Ejecutar `git diff`** y revisar que no haya: secretos, credenciales, archivos
   `.env` privados, cambios accidentales ni archivos innecesarios.
8. **Mostrar al desarrollador un resumen** de los cambios y del resultado de las
   verificaciones.
9. **Solicitar confirmación explícita** antes de ejecutar el commit cuando el
   entorno requiera aprobación humana.

> Puede usarse la skill `.agents/skills/verify-delivery` para ejecutar y
> documentar los pasos 1–8 de forma sistemática.

---

## Archivos / carpetas protegidos

El agente **no puede modificar sin confirmación explícita del desarrollador**:

- `CONTEXT.md` y `CONTEXT.es.md`.
- Los briefings originales (p. ej. los de `00-general-contexts` si existieran).
- Archivos `.env` con valores reales.
- Configuración de producción.
- Workflows de CI/CD.
- Infraestructura cloud.
- Credenciales y secretos.
- Archivos de otros hitos no relacionados con la tarea actual.
- El historial de Git y las ramas protegidas.

Además: **nunca eliminar código existente solo porque parezca no utilizado** sin
verificar antes su propósito.

---

## Reglas de seguridad

- **Nunca introducir** en archivos versionados: API keys, passwords, tokens,
  AWS Access Keys, AWS Secret Access Keys ni credenciales privadas.
- **Nunca imprimir secretos** en logs.
- **Nunca subir** `.env.local` (ni ningún `.env*.local`).
- Cualquier integración con modelos de IA o servicios externos debe hacerse a
  través de un backend seguro que custodie los secretos, no desde el frontend.

---

## Operaciones de Git

- No ejecutar `git add`, `git commit`, `git push`, `git merge` ni `git rebase`
  sin confirmación explícita del desarrollador.
- No cambiar de rama automáticamente si hay cambios sin commit o si el cambio
  puede causar pérdida de trabajo; primero ejecutar `git status` y reportar.
- No abrir Pull Requests automáticamente.
