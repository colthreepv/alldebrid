FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app
# RUN npm install -g npm@next --prefix=/usr/local
# RUN ln -s -f /usr/local/bin/npm /usr/bin/npm
RUN npm install -g npm@next

RUN npm install
WORKDIR /usr/src/app/backend
RUN npm install
WORKDIR /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
