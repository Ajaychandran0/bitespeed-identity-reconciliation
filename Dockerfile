# Use a Node.js base image
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ------------------------------
# 🛠 Development Stage
# ------------------------------
FROM base AS dev
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ------------------------------
# 🚀 Production Stage
# ------------------------------
FROM base AS prod
# Only install production dependencies
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
