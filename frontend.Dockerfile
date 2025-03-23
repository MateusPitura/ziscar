# Use the official Node.js image
FROM node:22

# Create a working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Set the working directory
WORKDIR /app/shared
# Copy package.json
COPY shared/package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application files
COPY shared/ ./

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .

# Expose the port for serving the static files
EXPOSE 5173

# Start the React app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
