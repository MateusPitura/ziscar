# Use the Node.js image
FROM node:22

# Set the working directory
WORKDIR /app/shared
# Copy package.json
COPY shared/package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application files
COPY shared/ ./

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
# Generate Prisma client
RUN npx prisma generate

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
