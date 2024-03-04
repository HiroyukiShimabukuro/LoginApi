FROM postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=local_password
ENV POSTGRES_DB=local_db
COPY init.sql /docker-entrypoint-initdb.d/

FROM node

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]