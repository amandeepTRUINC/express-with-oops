# Stage 1: Build the app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source code
COPY . .

# Generate Prisma client (if using schema.prisma)
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# Stage 2: Run the built app
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose the port your app runs on (update if not 3000)
EXPOSE 8000

# Run database migration (optional) & start app
CMD ["sh", "-c", "npx prisma generate && npm run start:prod"]
