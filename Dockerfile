# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend Dependencies & Production Runtime
FROM node:18-alpine AS runner
WORKDIR /app

# Copy backend package configuration & install production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --only=production

# Copy backend application source
COPY backend/ ./backend/

# Copy built frontend assets into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose server port
EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["node", "backend/server.js"]
