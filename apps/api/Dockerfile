# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY apps/api/package.json ./apps/api/

# Install dependencies
# We need to install dependencies in the root context or handle the workspace structure
# Simpler for MVP: Just copy everything and install in api folder or root
# Let's try to keep it simple: Copy the specific app and its deps
# But wait, it's a monorepo.
# Let's copy the whole monorepo context to be safe, or just the api if it has no local deps.
# It has no local deps on other packages.

COPY apps/api ./apps/api

WORKDIR /app/apps/api
RUN npm install

# Build
RUN npm run build

# Expose port
EXPOSE 3001

# Start
CMD ["npm", "start"]
