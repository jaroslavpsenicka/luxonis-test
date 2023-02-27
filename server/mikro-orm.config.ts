import { Options } from '@mikro-orm/core';
import { Estate } from './entities';
import { logger } from './utils';

const options: Options = {
  type: 'postgresql',
  entities: [Estate],
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME
  // logger: (msg) => logger.debug(msg),
  // debug: true
};

export default options;