FROM node:18-bullseye

RUN apk add --no-cache tzdata  \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV TZ=Asia/Jakarta

USER root
EXPOSE 3000

CMD ["npm", "start"]