import assert from 'assert'
import { SqlEntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { DI } from '../server';
import { Estate } from '../entities';

let scrapingInProgress = false;

/**
 * @returns true if scraping is in progress
 */
export const isScraping = () => scrapingInProgress

/**
 * Starts the scraping process.
 * The process may run only once 
 * @param recordCount Number of records to be scraped
 * @param progressFn Callback function to inform the caller
 */
export const start = (recordCount: number, delay: number, onChange: (currentCycle: number, cycleCount: number) => void, onComplete: () => void) => {
  assert(recordCount > 0 && recordCount <= 1000, "u crazy?");
  assert(delay > 0, "be gentle to the service");
  assert(scrapingInProgress === false, "scraping is already running, wait until completed or call stop()");

  scrapingInProgress = true

  const cycleCount = recordCount / 20
  let currentCycle = 0
  const em: SqlEntityManager = DI.orm.em as SqlEntityManager
  const doScrape = () => {
    if (!scrapingInProgress) return;
    const name = `Estate ${Math.floor(Math.random() * 100)}`
    const image = "https://via.placeholder.com/150"
    const estate = em.persist(new Estate(name, image))
    em.flush().then(() => {
      onChange(currentCycle++, cycleCount)
      if (currentCycle < cycleCount) {
        setTimeout(doScrape, delay);
      } else {
        scrapingInProgress = false;
        onComplete();
      }    
    })
  }

  em.createQueryBuilder(Estate).delete().execute()
    .then(() => doScrape());
}

/**
 * Stops the scraping process.
 */ 
export const stop = () => {
  assert(scrapingInProgress === true, "scraping is not running");
  scrapingInProgress = false
}

