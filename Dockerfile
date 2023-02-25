FROM node:18.13.0

COPY . /app/
WORKDIR /app
RUN yarn install --frozen-lockfile
RUN yarn build

RUN ls -l dist

EXPOSE 3000
CMD ["dist/server.js"]