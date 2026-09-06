# syntax=docker/dockerfile:1
FROM node:20-alpine

# Small utility used by the container HEALTHCHECK below.
RUN apk add --no-cache wget

WORKDIR /app

# Copy manifests first so this layer is cached until dependencies change.
COPY package*.json ./

# npm ci installs the exact versions from package-lock.json.
RUN npm ci --omit=dev

# Copy application source.
COPY . .

# Drop root privileges. The node image ships a non-root "node" user.
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.js"]
