# Multi-stage build for Angular
FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve using Nginx
FROM nginx:alpine

# Rimuovi la pagina di default di nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia i file compilati dalla fase di build
COPY --from=build /app/dist/Cefla-Carico-Lavoro/browser /usr/share/nginx/html

# Copia la configurazione personalizzata
COPY deploy-package/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
