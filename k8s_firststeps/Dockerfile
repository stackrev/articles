# From https://hub.docker.com/_/node alpine.
FROM node:alpine3.15

# Image info.
LABEL MAINTAINER=adarmanin.callforatlas@gmail.com
LABEL GITHUB=https://github.com/adamd1985
LABEL SITE=https://callforatlas.com

# Copy App, run Node, and Expose the webapp
COPY ./app /app
RUN cd /app; npm install
EXPOSE 8080

# Entry command on image start.
CMD cd /app && npm start
