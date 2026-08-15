FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY nest-cli.json tsconfig*.json ./
COPY apps ./apps
COPY libs ./libs
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY scripts/start-all.mjs ./scripts/start-all.mjs
RUN addgroup -S nest && adduser -S nest -G nest && mkdir -p /app/uploads && chown -R nest:nest /app
USER nest
CMD ["node", "dist/apps/api-gateway/main.js"]
