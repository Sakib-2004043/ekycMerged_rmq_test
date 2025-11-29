# —— Your exact backend Dockerfile ——
FROM node:18-alpine

# Install nodemon globally (because your "start" script uses it)
RUN npm install -g nodemon

# Set working directory
WORKDIR /app

# Copy only package files first → best caching
COPY package*.json ./
RUN npm install

# Now copy everything else (controllers, models, routes, rabbitMQ folder, index.js, etc.)
COPY . .

# Your app listens on port 5000 (change only if your index.js uses another port)
EXPOSE 5000

# This runs exactly the same as your local "npm start" → nodemon index.js
CMD ["npm", "start"]