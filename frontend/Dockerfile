# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
# RUN pnpm build

# Expose the port the app runs on
EXPOSE 3000

# # Start the Next.js application
# CMD ["pnpm", "start"]
LABEL org.opencontainers.image.source="https://gitea.kltn.internal/kltn/healthcare"