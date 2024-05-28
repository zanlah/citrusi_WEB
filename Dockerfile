# Start of the build stage
FROM node:20-alpine
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's source code from the local context to /app
COPY . .

RUN npm run build

EXPOSE 8080

# Define the command to run your app using CMD which will be executed during runtime
CMD ["npm", "run", "preview"]
