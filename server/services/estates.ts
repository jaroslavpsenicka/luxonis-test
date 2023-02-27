import { DI } from '../server';
import { Estate } from '../entities';

interface EntitiesWithMetadata<T> {
  entities: Array<T>,
  count: number
  offset: number
  limit: number
}

export const findEstates = (offset: number, limit: number): Promise<EntitiesWithMetadata<Estate>> => {
  return DI.orm.em.findAndCount(Estate, {}, { offset, limit })
    .then(([ entities, count]) => ({ entities, count, offset, limit} as EntitiesWithMetadata<Estate>))
}