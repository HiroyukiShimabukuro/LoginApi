FROM node

WORKDIR /usr/app

COPY package.json ./
RUN npm install docker
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]