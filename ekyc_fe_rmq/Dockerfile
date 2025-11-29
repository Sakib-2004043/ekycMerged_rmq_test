# ——— Frontend Dockerfile (Create-React-App) ———
# Stage 1: Build the React app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve it with nginx (tiny final image ~20 MB)
FROM nginx:alpine
# Copy the built files from stage 1
COPY --from=builder /app/build /usr/share/nginx/html
# Optional: copy custom nginx config if you need proxy/cors
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]