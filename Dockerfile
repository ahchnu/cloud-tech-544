FROM node:latest

RUN apt-get update
RUN apt-get install -y gnupg curl
RUN wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor --output /usr/share/keyrings/mongodb-server-7.0.gpg
RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
RUN apt-get update
RUN apt-get install -y mongodb-org
RUN mkdir -p /data/db

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000 27017

CMD mongod --fork --logpath /var/log/mongodb.log && npm start
