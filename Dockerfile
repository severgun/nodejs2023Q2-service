FROM node:20.11.1-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci && npm cache clean --force

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:20.11.1-slim as prod

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /app/package*.json .
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./

EXPOSE ${PORT}

CMD [  "npm", "run", "start:migrate:prod" ]