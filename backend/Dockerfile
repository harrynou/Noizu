# Use an official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Expose the port the backend listens on (5000 for local, 8080 for prod)
EXPOSE 8080

# Start the Node.js application
CMD ["npm", "run", "dev"]
