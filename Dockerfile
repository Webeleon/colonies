FROM node:latest

RUN mkdir /app
WORKDIR /app
ADD package.json /app/
COPY . /app/
RUN npm install

CMD [ "npm", "run","start" ]
