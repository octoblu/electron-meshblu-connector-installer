FROM electronuserland/electron-builder:wine
MAINTAINER Octoblu <docker@octoblu.com>

ENV NPM_CONFIG_LOGLEVEL error

RUN npm install --silent --global yarn

RUN yarn install --no-progress

RUN yarn run build

CMD [ "yarn", "run", "package-win" ]
