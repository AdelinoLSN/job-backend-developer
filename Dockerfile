FROM node:22.11.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./
COPY ./src ./src
COPY .env.docker .env

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
