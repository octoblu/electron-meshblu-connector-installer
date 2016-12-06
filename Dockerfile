FROM electronuserland/electron-builder:wine
MAINTAINER Octoblu <docker@octoblu.com>

ENV NPM_CONFIG_LOGLEVEL error

WORKDIR /project

COPY package.json yarn.lock /project/
COPY app/package.json app/yarn.lock /project/app/

RUN npm install --silent --global yarn

RUN yarn install --no-progress

COPY . /project

RUN yarn run build

CMD [ "yarn", "run", "package-win" ]
