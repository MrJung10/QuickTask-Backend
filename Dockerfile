FROM node:22-alpine

WORKDIR /app

# Install build dependencies for Prisma
RUN apk add --no-cache openssl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port
EXPOSE 5000

# Run migrations, seed, and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm start"]