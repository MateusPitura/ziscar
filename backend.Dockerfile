# Use the Node.js image
FROM node:22

ARG APP_ENV
ENV APP_ENV=$APP_ENV

# Set the working directory for shared
WORKDIR /app/shared
# Copy package.json for shared
COPY shared/package*.json ./
# Install dependencies for shared
RUN npm install
# Copy the rest of the application files for shared
COPY shared/ ./

# Set the working directory
WORKDIR /app/backend
# Copy package.json
COPY backend/package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application files
COPY backend/ ./

# Generate Prisma client
RUN npx prisma generate

CMD ["sh", "-c", "npm run ${APP_ENV}"]
