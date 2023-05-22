# Use the official Node.js 14 image as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm ci --production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the API will listen
EXPOSE 8000

# Start the API server
CMD ["node", "index.js"]
