# Stage 1: Build React App
FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

# Ignore peer dependency conflicts (e.g. TypeScript version)
RUN npm ci --legacy-peer-deps

COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine

# Copy build output to nginx html dir
COPY --from=build /app/build /usr/share/nginx/html

# Optional: replace default nginx config (you can customize this)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
