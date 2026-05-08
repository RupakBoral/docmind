# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

CMD ["node", "dist/src/index.js"]