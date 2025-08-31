# Use the Node.js image
FROM node:22

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

# Copy scripts directory for enum generation
COPY scripts/generate-shared-enums.js /app/scripts/

# Generate Prisma client and enums
RUN npx prisma generate
RUN cd /app && node scripts/generate-shared-enums.js

RUN npm run build

CMD sh -c "npm run dev:db-init && npm run start"
