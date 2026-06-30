FROM node:22-alpine

RUN apk add --no-cache tzdata

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV TZ=Asia/Jakarta

USER root
EXPOSE 3000

CMD ["npm", "start"]