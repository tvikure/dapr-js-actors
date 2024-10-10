# Base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

RUN npm run build

# Expose port for the app
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
