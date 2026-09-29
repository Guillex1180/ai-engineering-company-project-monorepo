# Verify Delivery Skill

## Objective

Verificar que los cambios realizados en TrackFlow cumplen el contexto, las reglas
del repositorio y las verificaciones técnicas antes de ser entregados (commit).
Objetivo único: **decidir si un cambio está listo para entregar (listo / no listo)**
y producir un reporte que lo justifique.

## Inputs

- **Archivos modificados** (lista de rutas).
- **Aplicación/servicio afectado** (p. ej. `uis/website`, `uis/backoffice`,
  `packages/trackflow-core`).
- **Requisito o feature implementada** (qué se pidió).
- **Comandos de validación disponibles** en el proyecto afectado (p. ej.
  `npm run lint`, `npm run typecheck`, `npm run build`, `tsc --noEmit`).

## Procedure

1. Leer el contexto y las reglas aplicables (`CONTEXT.md`, `memory-bank/*`,
   README del área, `.agents/rules/`).
2. Revisar los archivos modificados.
3. Comparar la implementación contra el requisito solicitado.
4. Ejecutar `lint` (si está configurado).
5. Ejecutar `typecheck` (si existe; si no, `tsc --noEmit` cuando aplique).
6. Ejecutar `tests` (si existen).
7. Ejecutar `build` (cuando corresponda al proyecto).
8. Revisar `git diff`.
9. Verificar ausencia de secretos y de archivos `.env` privados listos para commit.
10. Verificar que el Memory Bank (`progress.md` y, si aplica, `techContext.md`)
    esté actualizado.
11. Generar el reporte de entrega.

## Expected Output

Un reporte que incluya:

- Cambios encontrados (archivos y resumen).
- Validaciones ejecutadas.
- Resultado de cada validación.
- Problemas encontrados.
- Estado del Memory Bank.
- Estado final: **listo / no listo**.

## Acceptance Criteria

Criterios explícitos y verificables. La skill **no** se considera aprobada si no
puede comprobar todos los aplicables:

- [ ] `CONTEXT.md` fue revisado.
- [ ] Las reglas aplicables (`.agents/rules/`) fueron revisadas.
- [ ] No existen errores de compilación provocados por el cambio.
- [ ] `lint` pasa cuando está configurado.
- [ ] `typecheck` pasa cuando está configurado.
- [ ] `tests` pasan cuando existen.
- [ ] `build` pasa cuando corresponde.
- [ ] No existen secretos en los cambios.
- [ ] No existen archivos `.env` privados preparados para commit.
- [ ] El Memory Bank refleja el estado actual.
- [ ] Los cambios corresponden al requisito solicitado.
- [ ] El desarrollador recibe un reporte antes del commit.
