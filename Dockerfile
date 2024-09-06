# Use a Node.js base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# List the contents of the dist directory
RUN ls -la dist

# Run the compiled JavaScript code
CMD [ "node", "dist/server.js" ]