# ==========================
# Stage 1 - Dependencies
# ==========================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci


# ==========================
# Stage 2 - Build
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN echo "API URL: $NEXT_PUBLIC_BASE_URL_API"

RUN npm run build


# ==========================
# Stage 3 - Production
# ==========================
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache tzdata

ENV TZ=Asia/Jakarta
ENV NODE_ENV=production

COPY --from=builder /app ./

USER root
EXPOSE 3000

CMD ["npm", "run", "start"]