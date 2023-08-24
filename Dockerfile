FROM node:lts-alpine

# Install build dependencies for native modules
RUN apk update && apk add --no-cache \
    python2 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    bash \
    imagemagick \
    fontconfig-dev

# Install fonts and fontconfig
RUN apk add --no-cache ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family fontconfig

# Create the directory!
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copy the app's package.json
COPY package*.json ./

# Install the app
USER node
RUN npm install --production --silent

# Copy the app's files
COPY --chown=node:node . .

# Start the app
CMD ["npm", "run", "start"]
