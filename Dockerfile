# Build stage
FROM node:18 AS build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN rm -rf node_modules .package-lock.json package-lock.json
RUN npm install
COPY frontend .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
