# Etapa 1: Imagen base ligera
FROM node:20-alpine AS base

# Etapa 2: Instalar dependencias (Cache)
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Etapa 3: Construir el proyecto
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# La variable NEXT_TELEMETRY_DISABLED acelera un poco el build
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Etapa 4: Imagen final de producción (Solo lo necesario)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Por seguridad, no ejecutamos como root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos la carpeta public (imágenes, iconos)
COPY --from=builder /app/public ./public

# Configuramos permisos para la carpeta de caché de Next
RUN mkdir .next
RUN chown nextjs:nodejs .next

# MAGIA STANDALONE: Copiamos solo los archivos que Next.js detectó como necesarios
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiamos al usuario sin privilegios
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Iniciamos la app directamente con Node, no con "npm start"
CMD ["node", "server.js"]