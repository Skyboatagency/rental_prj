# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Build your app
RUN npm run build

# Expose port (adjust this based on your app)
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
