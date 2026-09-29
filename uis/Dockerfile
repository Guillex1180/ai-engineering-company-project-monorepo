# Imagen de interfaces: website (Tailwind estático) + backoffice (Next.js).
# Node 20 LTS Alpine: compatible con Next 14.2.x (requiere Node >=18.17) y ligera.
FROM node:20-alpine

WORKDIR /app

# --- Instalación de dependencias por app, con lockfile (npm ci) ---
# Se copian primero los manifests para aprovechar la caché de capas de Docker:
# si el código cambia pero no las dependencias, no se reinstala.
COPY website/package.json website/package-lock.json ./website/
RUN cd website && npm ci

COPY backoffice/package.json backoffice/package-lock.json ./backoffice/
RUN cd backoffice && npm ci

# --- Código de las dos apps ---
COPY website ./website
COPY backoffice ./backoffice

# Script de arranque de ambas apps.
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Puertos: website 3000, backoffice 3001.
EXPOSE 3000 3001

CMD ["/app/start.sh"]
