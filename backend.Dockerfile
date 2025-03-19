# Use the Node.js image
FROM node:22

# Install necessary dependencies for Puppeteer
RUN apt update && apt install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

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
RUN npm run build

CMD ["npm", "run", "start:prod"]
