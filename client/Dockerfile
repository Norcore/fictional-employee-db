FROM node:alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm cache clean --force
RUN npm install
RUN npm install react-scripts react-router-dom

# Copy the rest of the application
COPY . .

EXPOSE  3000

CMD [ "npm", "run", "build" ]
