# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client (necessary for Prisma to work)
RUN pnpm prisma generate

# Expose the port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]
