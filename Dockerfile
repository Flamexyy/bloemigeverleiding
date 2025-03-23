FROM node:22.12.0-slim AS base

FROM base AS deps
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile

FROM base AS builder
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm
RUN pnpm run build

FROM base AS runner
ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
WORKDIR /app
RUN corepack enable pnpm
COPY . .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD node server.js