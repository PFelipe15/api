FROM node:latest

WORKDIR /api

COPY package*.json ./

RUN rm -rf node_modules

RUN npm install

RUN npm run build

COPY . .

RUN npx prisma generate

RUN npm run start

EXPOSE 8080

CMD ["npm", "start"]