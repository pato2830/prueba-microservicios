FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./

# Variable temporal para generar Prisma durante el build.
# La conexión real se configura al iniciar el contenedor.
ENV DATABASE_URL="postgresql://postgres:build_placeholder@localhost:5432/users_db?schema=public"

RUN npx prisma generate

COPY src ./src

EXPOSE 8082

CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed:admin && npm start"]