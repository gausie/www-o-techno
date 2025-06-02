# Use Node.js LTS as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Enable corepack for Yarn
RUN corepack enable

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Run prepare script for panda css codegen
RUN yarn prepare

# Build the application
RUN yarn build

# Install serve to run the application
RUN yarn global add serve

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"] 