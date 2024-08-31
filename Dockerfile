FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules

RUN npm install

COPY . .
RUN npx prisma generate

RUN npm run build

 CMD ["npm", "start"]

 EXPOSE 8080