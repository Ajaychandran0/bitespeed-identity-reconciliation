# ------------------------------
# Base Stage
# ------------------------------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ------------------------------
# Development Stage
# ------------------------------
FROM base AS dev
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ------------------------------
# Builder Stage (for compiling TypeScript)
# ------------------------------
FROM base AS builder
RUN npm install
COPY . .
RUN npm run build

# ------------------------------
# Production Stage
# ------------------------------
FROM base AS prod
# Only install production dependencies
RUN npm ci --only=production
# Copy only compiled output from builder
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start"]
