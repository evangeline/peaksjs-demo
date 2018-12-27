FROM ubuntu:18.04

# Install Node.js
RUN apt-get update
RUN apt-get install curl gnupg -yq
RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt-get install nodejs -yq
RUN apt-get install build-essential -yq

RUN apt-get install software-properties-common -yq
RUN add-apt-repository ppa:chris-needham/ppa
RUN apt-get install audiowaveform -yq

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
