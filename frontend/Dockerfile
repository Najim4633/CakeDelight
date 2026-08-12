# Stage 1: Build the React application
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# Stage 2: Serve the app using Nginx
FROM nginx:alpine

COPY --from=builder /app/.output/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]