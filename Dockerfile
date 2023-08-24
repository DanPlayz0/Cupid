FROM node:lts-alpine

# Create the directory!
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copy the app's package.json
COPY package*.json ./

# Canvas Dependencies
RUN apk add --no-cache \
  build-base \
  g++ \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev
RUN apk add --update  --repository http://dl-3.alpinelinux.org/alpine/edge/testing libmount ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family fontconfig

# Install the app
USER node
RUN npm install --production --silent

# Copy the app's files
COPY --chown=node:node . .

# Start the app
CMD ["npm", "run", "start"]
