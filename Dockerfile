FROM node:14-alpine

COPY .npmrc /app/
COPY package*.json /app/
COPY src/api/package*.json /app/src/api/

WORKDIR /app

RUN npm install

COPY src /app/src

EXPOSE 3000

CMD ["npm", "start"]