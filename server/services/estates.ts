import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';

import { DI } from '../server';
import { Estate } from '../entities';

export const findEstates = (): Promise<Array<Estate>> => {
  return DI.estateRepository.findAll({})
}