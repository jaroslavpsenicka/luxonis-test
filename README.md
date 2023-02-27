This is Luxonis TEST project.

![image](https://user-images.githubusercontent.com/7488860/221572964-0e13b0a5-e23d-41a9-a33e-d0ccee28f751.png)


## Service implementation
Implemented as standard Express application.

There are following endpoints exposed. All endpoints use standard HTTP status codes.

### GET /api/estates
Provides estates data.
Parameters:
```
- offset: start index of requested dataset (number)
- limit: number of records to be returned (number)
```
Returns a structure of following fields:
```
- count: total count of records (number)
- offset: start index of returned dataset (number)
- limit: number of records of returned dataset (number)
- entities: a data of following structure:
  - name: estate name (string)
  - image: estate image (string)
```

### GET /api/scraping
Provides scraping status.

Returns a structure of following fields:
```
- running: a flag indicating running scraping process (true/false)
- progress: percentage of scraped data (number 0-100)
```

### GET /api/scraping/events
Provides scraping status in form of SSE events (while the scraping process is running).

Returns a percentage number.

### POST /api/scraping
Initiates the scraping process.

Returns no data.

### DELETE /api/scraping
Stops the scraping process.

Returns no data.

## User interface
Implemented as standard React application. Uses Context API for state management. Uses Boostrasp CSS.

## Testing
Uses Mocha/Chai for service tests and JEST/Jasmine for FE tests.

Example of successfully executed tests:
```
~/Projects/luxonis-test $ yarn test
yarn run v1.22.4
$ tsc && mocha dist/**/*.spec.js --exit


  Estates
    ✔ should return estates
2023-02-27T14:42:20.929Z [INFO] ORM initialized
2023-02-27T14:42:20.930Z [INFO] Server is running at http://localhost:3000
    ✔ should start scraping with defaults
    ✔ should start scraping with count param
    ✔ should start scraping with delay param
    ✔ should not stop scraping when not running


  5 passing (658ms)

✨  Done in 6.92s.
```

## Deployment 
To start the project, run `docker-compose up`, note the following options:
- setup `DOCKER_BUILDKIT=0` env variable to show verbose output
- use `--build` to force rebuilding the app image (it takes a while to rebuild)

Navigate to http://localhost:3000 to open the app.

Example starting the project:
```
~/Projects/luxonis-test $ DOCKER_BUILDKIT=0 docker-compose up --build
Building api-server
Sending build context to Docker daemon  2.648MB
Step 1/7 : FROM node:18.13.0
 ---> b68a472583ef
Step 2/7 : COPY . /app/
 ---> 01f0ab9c3df7
Step 3/7 : WORKDIR /app
 ---> Running in 0dbe49aac731
Removing intermediate container 0dbe49aac731
 ---> 34711368533b
Step 4/7 : RUN yarn install --frozen-lockfile
 ---> Running in 2160725d5c4a
yarn install v1.22.19
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
Done in 106.51s.
Removing intermediate container 2160725d5c4a
 ---> 71aea20ddacd
Step 5/7 : RUN yarn build
 ---> Running in 3321fb333f2b
yarn run v1.22.19
$ tsc && NODE_ENV=production REACT_APP_VERSION=$npm_package_version BUILD_PATH='./dist/web' react-scripts build
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  112.07 kB  web/static/js/main.5507104f.js
  13 kB      web/static/js/607.bbb296bc.chunk.js
  1.65 kB    web/static/js/pages.5a31f9d7.chunk.js
  262 B      web/static/css/main.479cb196.css

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The dist/web folder is ready to be deployed.
You may serve it with a static server:

  yarn global add serve
  serve -s dist/web

Find out more about deployment here:

  https://cra.link/deployment

Done in 44.15s.
Removing intermediate container 3321fb333f2b
 ---> 9d038002c5e5
Step 6/7 : EXPOSE 3000
 ---> Running in 422c0c6c1127
Removing intermediate container 422c0c6c1127
 ---> 6eae5bde851c
Step 7/7 : CMD ["dist/server.js"]
 ---> Running in 4dd0b79050e4
Removing intermediate container 4dd0b79050e4
 ---> 0692098aa140
Successfully built 0692098aa140
Successfully tagged luxonis-test-app:latest
Starting luxonis-test-dtb ... done
Recreating luxonis-test-app ... done
Attaching to luxonis-test-dtb, luxonis-test-app
luxonis-test-dtb | 
luxonis-test-dtb | PostgreSQL Database directory appears to contain a database; Skipping initialization
luxonis-test-dtb | 
luxonis-test-dtb | 2023-02-27 02:12:54.372 UTC [1] LOG:  starting PostgreSQL 14.1 on x86_64-pc-linux-musl, compiled by gcc (Alpine 10.3.1_git20211027) 10.3.1 20211027, 64-bit
luxonis-test-dtb | 2023-02-27 02:12:54.373 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
luxonis-test-dtb | 2023-02-27 02:12:54.373 UTC [1] LOG:  listening on IPv6 address "::", port 5432
luxonis-test-dtb | 2023-02-27 02:12:54.386 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
luxonis-test-dtb | 2023-02-27 02:12:54.401 UTC [22] LOG:  database system was interrupted; last known up at 2023-02-27 02:07:10 UTC
luxonis-test-dtb | 2023-02-27 02:12:54.679 UTC [22] LOG:  database system was not properly shut down; automatic recovery in progress
luxonis-test-dtb | 2023-02-27 02:12:54.682 UTC [22] LOG:  redo starts at 0/1725BC8
luxonis-test-dtb | 2023-02-27 02:12:54.682 UTC [22] LOG:  invalid record length at 0/1725C00: wanted 24, got 0
luxonis-test-dtb | 2023-02-27 02:12:54.682 UTC [22] LOG:  redo done at 0/1725BC8 system usage: CPU: user: 0.00 s, system: 0.00 s, elapsed: 0.00 s
luxonis-test-dtb | 2023-02-27 02:12:54.707 UTC [1] LOG:  database system is ready to accept connections
luxonis-test-app | 2023-02-27T02:12:56.645Z [INFO] ORM initialized
luxonis-test-app | 2023-02-27T02:12:56.665Z [INFO] Server is running at http://localhost:3000
```

## Future improvements
- API documentation - a solution like Swagger may be used to improve the API documentation
- caching - there is no server cache used ATM, a simple solution like [node-cache](https://github.com/node-cache/node-cache) or [route-cache](https://github.com/bradoyler/route-cache) may be used, the cache must be properly invalidated at the end of a (re)scraping process
- scraping options UI - there are certain options avaiable on the API (dataset size and delay between estate service requests), this is not avbailable for end users and it may help when experiencing difficulties due to estate service throttling
- mobile interface - only basic layout is implemented (tested on iPhone SE), may be improved by reducing some of the visual elements (white wrapper)
- FE tests
