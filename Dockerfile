# Use an official Node runtime as the base image
FROM node:18

# # Use Ubuntu as the base image
# FROM ubuntu:20.04

# # Avoid prompts from apt
# ENV DEBIAN_FRONTEND=noninteractive

# # Install Node.js, npm, and Nginx
# RUN apt-get update && apt-get install -y curl gnupg2 && \
#     curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
#     apt-get install -y nodejs nginx 

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest
COPY . .

# Populate the DB
RUN npm run executeSeeding

# Build the Next.js app
RUN npm run build



# Expose the ports
EXPOSE 3000 4000 5432

# # Set environment variable to control dev/prod mode
# ARG NODE_ENV=dev
# ENV NODE_ENV=${NODE_ENV}


# # Start both applications concurrently
# CMD if [ "$NODE_ENV" = "prod" ]; then \
#         npm run start; \
#     else \
#         npm run dev:servers; \
#     fi

