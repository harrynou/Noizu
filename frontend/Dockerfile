# Use an official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app for production
RUN npm run build

# Use a lightweight web server to serve the production build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 5173 for the server
EXPOSE 5173

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
