FROM electronuserland/electron-builder:wine
MAINTAINER Octoblu <docker@octoblu.com>

RUN apt-get update
RUN apt-get install -y curl libssl-dev libcurl4-openssl-dev libgsf-1-dev autoconf build-essential

ENV NPM_CONFIG_LOGLEVEL error

RUN mkdir -p /project/app
WORKDIR /project

COPY package.json yarn.lock /project/
COPY app/package.json app/yarn.lock /project/app/

RUN npm install --silent --global yarn

RUN yarn install

COPY . /project

RUN yarn run build

CMD [ "./deploy/windows/deploy.sh" ]
