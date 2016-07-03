FROM node:argon
ENV PORT=8100

RUN npm install -g npm@next
# Create app directory
RUN mkdir -p /code
WORKDIR /code
COPY . /code
RUN npm install
RUN npm run install:backend
RUN npm run install:fonts

EXPOSE 8100
CMD [ "npm", "run", "production" ]
