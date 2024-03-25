FROM node:20.11.1-alpine3.19 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

FROM node:20.11.1-alpine3.19

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./

EXPOSE ${PORT}

CMD [  "npm", "run", "start:migrate:prod" ]