FROM node:18.13.0

COPY . /app/
WORKDIR /app
RUN yarn install --frozen-lockfile
RUN yarn build

EXPOSE 3000
CMD ["dist/server.js"]