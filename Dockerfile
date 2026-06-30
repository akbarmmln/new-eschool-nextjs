FROM node:22-alpine

RUN apk add --no-cache tzdata

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV TZ=Asia/Jakarta

RUN npm run build

USER root
EXPOSE 3000

CMD ["npm", "start"]