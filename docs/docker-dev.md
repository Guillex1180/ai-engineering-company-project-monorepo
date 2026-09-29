# Entorno de desarrollo con Docker — TrackFlow

Guía para levantar toda la plataforma con un solo comando y resolver problemas
frecuentes en la primera ejecución.

## Requisitos

- Docker Desktop (o Docker Engine + Compose v2) instalado y **en marcha**.
- No necesitas Node ni Python en el host: todo corre en contenedores.

## Arranque

Desde la **raíz** del repositorio:

```bash
cp .env.example .env      # solo la primera vez (no contiene secretos)
docker compose up          # añade -d para ejecutarlo en segundo plano
```

Servicios:

| Servicio      | URL                     | Descripción                          |
| ------------- | ----------------------- | ------------------------------------ |
| Website       | http://localhost:3000   | Landing pública (Tailwind estático)  |
| Backoffice    | http://localhost:3001   | Panel interno (Next.js)              |
| Backend API   | http://localhost:8000   | FastAPI (docs en `/docs`, `/health`) |

Para detener: `Ctrl+C` (o `docker compose down` si usaste `-d`).

## Comandos útiles

```bash
docker compose config     # valida la configuración sin arrancar
docker compose build      # construye las imágenes
docker compose ps         # estado de los contenedores
docker compose logs -f interfaces   # logs del contenedor de UIs
docker compose logs -f backend      # logs del backend
```

## Arquitectura

- **`interfaces`** (`node:20-alpine`, build `./uis`): un contenedor con las dos apps.
  `start.sh` arranca website (:3000) y backoffice (:3001), ambas en `0.0.0.0`.
- **`backend`** (`python:3.12-slim`, build `./services`): FastAPI con `uvicorn --reload`
  en `:8000`. Dependencias instaladas con `uv`.
- Red `trackflow-network`. El backend expone `/health` (usado por el healthcheck).

## Hot reload

El código se monta por bind mount, así que editar archivos en el host recarga sin
`docker compose build`:

- Website: al guardar, Tailwind recompila el CSS (watch).
- Backoffice: Next.js Fast Refresh.
- Backend: Uvicorn `--reload`.

`node_modules` y `.next` se preservan con volúmenes anónimos (no los tapa el bind mount).
El file watching usa polling (`WATCHPACK_POLLING`, `CHOKIDAR_USEPOLLING`) para ser
fiable en Docker Desktop/macOS.

## Navegador vs red interna

El frontend llama al backend con `NEXT_PUBLIC_API_URL=http://localhost:8000` porque el
**navegador corre en el host**. La comunicación contenedor→contenedor (si se añadiera
tráfico server-side) usaría el hostname del servicio: `http://backend:8000`.

## Solución de problemas

- **Puertos ocupados (3000/3001/8000):** detén cualquier `npm run dev`/`uvicorn` local
  antes de `docker compose up`, o cambia los puertos en `.env`.
- **El website no tiene estilos al primer instante:** `start.sh` genera el CSS al arrancar;
  si editas `src/input.css`, el watch lo regenera. Recarga la página.
- **Cambios que no se reflejan:** confirma que el bind mount está activo (`docker compose
  ps`) y que las variables de polling están puestas (ya vienen en `docker-compose.yml`).
- **El backend no encuentra `incident_analysis`:** el paquete compartido se monta en
  `/shared/incident-analysis` y se expone con `PYTHONPATH`. No muevas ese volumen.
- **Reconstruir tras cambiar dependencias** (nuevos paquetes en un `package.json` o en
  `requirements.txt`): `docker compose build` y vuelve a `docker compose up`.
