# Build app
FROM node:19-alpine as node

RUN mkdir -p /usr/src
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

COPY package.json yarn.lock decorate-angular-cli.js /usr/src/app/
RUN yarn install --frozen-lockfile

COPY . /usr/src/app

RUN yarn nx build detalluz-backend --configuration=production


# Configure Nginx
FROM node:19-alpine as server

COPY --from=node /usr/src/app/dist/apps/detalluz-backend/ .

CMD ["node", "main.cjs"]
