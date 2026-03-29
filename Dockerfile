FROM node:20-slim

WORKDIR /app

# Copy package files and install
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and data
COPY tsconfig.json ./
COPY src/ ./src/
COPY data/ ./data/

# Build TypeScript
RUN npm run build

# Railway sets PORT automatically
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js"]
