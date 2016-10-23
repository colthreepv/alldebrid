FROM node:boron
ENV PORT=8100

RUN mkdir -p /code
WORKDIR /code
# Install app dependencies - with cache
COPY package.json /code/
RUN npm install
COPY backend/package.json /code/backend/
RUN npm run install:backend

# Code-specific
COPY . /code
RUN npm run install:fonts
RUN npm run build

EXPOSE 8100
CMD [ "npm", "run", "backend" ]
