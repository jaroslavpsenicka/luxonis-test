import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';

import routes from './routes';
import { logger } from './utils';
import { Estate } from './entities';

dotenv.config();

export const DI = {} as {
  server: http.Server;
  orm: MikroORM
};
    
const app = express();

app.use(express.static(path.join(__dirname, './web')));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

app.use(routes);

app.use(( err: Error, req: Request, res: Response, next: NextFunction ) => res.status(500).json({ error: err.message }));

MikroORM.init<PostgreSqlDriver>().then(orm => {
  logger.info("ORM initialized");
  DI.orm = orm;
  app.listen(process.env.PORT, () => logger.info(`Server is running at http://localhost:${process.env.PORT}`));
})

export default app;
