FROM node:22

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json ./

RUN apt-get update
RUN ["apt-get","install", "-y", "build-essential", "libcairo2-dev", "libpango1.0-dev", "libjpeg-dev", "libgif-dev" ,"librsvg2-dev"]

RUN npm i
COPY . .
RUN npm run build

EXPOSE 8000

CMD [ "npm", "start" ]
