FROM node:20

WORKDIR /usr/src/app

# would copy package-lock.json file also
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3003

CMD ["node", "index.js"]