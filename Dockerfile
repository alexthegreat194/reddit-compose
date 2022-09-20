FROM node:latest

WORKDIR .

COPY package.json .

RUN npm install

COPY . .

RUN npx prisma generate

CMD ["npm", "start"]