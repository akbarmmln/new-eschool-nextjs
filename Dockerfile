# ==========================
# Stage 1 - Build
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# ==========================
# Stage 2 - Production
# ==========================
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache tzdata

ENV NODE_ENV=production
ENV TZ=Asia/Jakarta

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
#===============================================#

# FROM node:22-alpine AS deps

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci

# FROM node:22-alpine AS builder

# WORKDIR /app

# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# ENV NODE_ENV=production

# RUN npm run build

# FROM node:22-alpine

# WORKDIR /app

# RUN apk add --no-cache tzdata

# ENV TZ=Asia/Jakarta
# ENV NODE_ENV=production

# COPY --from=builder /app ./

# EXPOSE 3000

# CMD ["npm", "run", "start"]
#===============================================#

# FROM node:22-alpine

# RUN apk add --no-cache tzdata

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# COPY . .

# ENV NODE_ENV=production
# ENV TZ=Asia/Jakarta

# RUN npm run build

# USER root
# EXPOSE 3000

# CMD ["npm", "start"]