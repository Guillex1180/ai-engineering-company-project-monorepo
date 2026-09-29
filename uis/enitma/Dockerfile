# Imagen de la plataforma enITma (Next.js: Home + API del asistente Space AI).
# Node 20 LTS Alpine: compatible con Next 14.2.x.
FROM node:20-alpine

WORKDIR /app

# Dependencias primero (caché de capas).
COPY package.json package-lock.json ./
RUN npm ci

# Código de la app.
COPY . .

# Puerto de desarrollo de enITma.
EXPOSE 3002

# Next dev escuchando en todas las interfaces del contenedor.
CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "3002"]
