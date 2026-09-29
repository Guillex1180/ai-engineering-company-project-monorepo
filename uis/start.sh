#!/bin/sh
# Arranca AMBAS apps de interfaces en un único contenedor (desarrollo).
#
#   website   -> Tailwind CLI en watch + servidor estático en 0.0.0.0:3000
#   backoffice-> next dev en 0.0.0.0:3001
#
# Manejo de señales: al recibir TERM/INT (docker stop), se matan ambos procesos
# hijos y sus árboles, evitando procesos huérfanos. El contenedor vive mientras
# ambos procesos sigan vivos.
set -eu

WEBSITE_DIR=/app/website
BACKOFFICE_DIR=/app/backoffice

# PIDs de los procesos hijos.
PIDS=""

# Limpieza: termina los hijos al recibir una señal o al salir.
cleanup() {
  echo "[start.sh] Deteniendo procesos…"
  for pid in $PIDS; do
    # Mata el proceso si sigue vivo (ignora si ya no existe).
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
  exit 0
}
trap cleanup TERM INT

# --- Website: compila Tailwind (watch) y sirve estático en 0.0.0.0:3000 ---
# Usa los scripts npm del proyecto y los binarios locales (sin descargas en runtime).
(
  cd "$WEBSITE_DIR"
  # Genera el CSS una vez para que la primera carga tenga estilos…
  ./node_modules/.bin/tailwindcss -i ./src/input.css -o ./dist/output.css --minify
  # …y mantiene el CSS en watch (hot reload) en segundo plano.
  npm run watch:css &
  # Servidor estático escuchando en todas las interfaces del contenedor.
  npm run serve:host
) &
PIDS="$PIDS $!"
echo "[start.sh] Website arrancando en 0.0.0.0:3000"

# --- Backoffice: Next.js dev en :3001, escuchando en 0.0.0.0 ---
(
  cd "$BACKOFFICE_DIR"
  ./node_modules/.bin/next dev -H 0.0.0.0 -p 3001
) &
PIDS="$PIDS $!"
echo "[start.sh] Backoffice arrancando en 0.0.0.0:3001"

# Mantiene el contenedor vivo mientras ambos procesos existan.
# BusyBox/ash no soporta `wait -n`, así que se sondea con un bucle POSIX:
# si alguno de los hijos muere, se termina el resto y sale.
while :; do
  for pid in $PIDS; do
    if ! kill -0 "$pid" 2>/dev/null; then
      echo "[start.sh] Un proceso ($pid) terminó; deteniendo el resto."
      cleanup
    fi
  done
  sleep 3
done
