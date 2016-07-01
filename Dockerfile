FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
# RUN npm install -g npm@next --prefix=/usr/local
# RUN ln -s -f /usr/local/bin/npm /usr/bin/npm
# RUN npm install -g npm@next
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
