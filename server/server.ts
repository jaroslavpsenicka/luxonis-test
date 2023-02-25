import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import http from 'http';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';
import cache from "express-aggressive-cache";

import routes from './routes';
import { logger } from './utils';
import { Estate } from './entities';

dotenv.config();

export const DI = {} as {
  server: http.Server;
  orm: MikroORM,
  em: EntityManager,
  estateRepository: EntityRepository<Estate>
};
    
const app = express();

app.use(express.static(path.join(__dirname, './web')));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cache({ maxAge: 3600 }).middleware);
app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

app.use(routes);

app.use(( err: Error, req: Request, res: Response, next: NextFunction ) => res.status(500).json({ error: err.message }));

MikroORM.init().then(orm => {
  logger.info("ORM initialized");
  DI.orm = orm;
  DI.em = DI.orm.em;
  DI.estateRepository = DI.orm.em.getRepository(Estate);
  app.listen(process.env.PORT, () => logger.info(`Server is running at http://localhost:${process.env.PORT}`));
})

export default app;
