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

RUN npm run build
RUN npm install serve

EXPOSE  3000

CMD [ "npx", "serve", "-s", "build", "-l", "3000"]
