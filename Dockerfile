FROM node:latest AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:latest

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/.env ./
COPY --from=build /usr/src/app/package*.json ./

RUN npm install --only=production

EXPOSE 4000

CMD ["node", "dist/index.js"]
