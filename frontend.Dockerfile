# Use the official Node.js image
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
WORKDIR /app/frontend
# Copy package.json
COPY frontend/package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application files
COPY frontend/ .

# Start the React app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
