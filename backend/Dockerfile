FROM node:12
WORKDIR /app
COPY package.json /app
RUN npm install
COPY src src
CMD npm run lin_prod
EXPOSE 3000
USER node