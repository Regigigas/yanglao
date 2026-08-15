FROM node:20-alpine AS build
WORKDIR /app
COPY web-admin/package.json web-admin/package-lock.json ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund
COPY web-admin ./
RUN npm run build:prod

FROM nginx:1.27-alpine
COPY docker/nginx/conf/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

