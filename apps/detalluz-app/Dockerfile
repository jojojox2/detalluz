# Build app
FROM node:19-alpine as node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

COPY package.json yarn.lock decorate-angular-cli.js /usr/src/app/
RUN yarn install --frozen-lockfile

COPY . /usr/src/app

RUN yarn nx build detalluz-app --configuration=production


# Configure Nginx
FROM nginx:1.23-alpine as nginx

COPY --from=node /usr/src/app/dist/apps/detalluz-app/ /usr/share/nginx/html

COPY ./apps/detalluz-app/nginx.detalluz.conf /etc/nginx/templates/default.conf.template
COPY ./apps/detalluz-app/nginx.server.conf /etc/nginx/nginx.conf
