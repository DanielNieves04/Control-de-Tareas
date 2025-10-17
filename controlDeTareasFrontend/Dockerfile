# build stage
FROM node:18 AS build

WORKDIR /app

COPY controlDeTareasFrontend/package*.json ./
RUN npm install

COPY controlDeTareasFrontend/ ./
RUN npm run build

# production stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY controlDeTareasFrontend/nginx/default.conf /etc/nginx/conf.d/default.conf


EXPOSE 80