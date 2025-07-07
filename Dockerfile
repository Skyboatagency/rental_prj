# ---------- Build Stage ----------
    FROM node:18 AS build

    # Set working directory
    WORKDIR /app
    
    # Install dependencies
    COPY frontend/package*.json ./
    RUN rm -rf node_modules package-lock.json
    RUN npm install --legacy-peer-deps
    
    # Copy project files and build
    COPY frontend . 
    RUN npm run build
    
    # ---------- Production Stage ----------
    FROM nginx:alpine
    
    # Copy the React build to Nginx's web directory
    COPY --from=build /app/build /usr/share/nginx/html
    
    # Expose port 80
    EXPOSE 80
    
    # Run Nginx in the foreground
    CMD ["nginx", "-g", "daemon off;"]
    