# Use a Node.js base image
FROM node:14-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY frontend ./

# Build the application
RUN npm run build

# Use a lightweight nginx image to serve the built application
FROM nginx:alpine

# Copy the built application to the nginx server directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that the nginx server listens on
EXPOSE 80

# Command to start nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
