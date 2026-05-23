# --- ETAPA DE COMPILACIÓN ---
FROM node:22-slim AS builder

WORKDIR /usr/src/app

# Copiar metadatos de dependencias
COPY package*.json ./

# Instalar todas las dependencias
RUN npm install

# Copiar el código fuente y las configuraciones
COPY . .

# Variables de compilación inyectadas por Docker (NextJS las inyecta en el cliente)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_TRUSTLESS_WORK_API_URL
ARG NEXT_PUBLIC_TRUSTLESS_WORK_API_KEY
ARG NEXT_PUBLIC_USDC_ISSUER
ARG NEXT_PUBLIC_STELLAR_NETWORK

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_TRUSTLESS_WORK_API_URL=$NEXT_PUBLIC_TRUSTLESS_WORK_API_URL
ENV NEXT_PUBLIC_TRUSTLESS_WORK_API_KEY=$NEXT_PUBLIC_TRUSTLESS_WORK_API_KEY
ENV NEXT_PUBLIC_USDC_ISSUER=$NEXT_PUBLIC_USDC_ISSUER
ENV NEXT_PUBLIC_STELLAR_NETWORK=$NEXT_PUBLIC_STELLAR_NETWORK

# Compilar NextJS para producción
RUN npm run build

# --- ETAPA DE PRODUCCIÓN ---
FROM node:22-slim AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
COPY package*.json ./

# Instalar solo dependencias de producción de forma limpia
RUN npm install --omit=dev

# Copiar el build compilado (.next estático y de servidor)
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.ts ./next.config.ts

# Cloud Run inyecta el puerto 8080 automáticamente
EXPOSE 8080
ENV PORT=8080

CMD ["npm", "run", "start"]
