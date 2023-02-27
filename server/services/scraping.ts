import assert from 'assert'
import { SqlEntityManager, EntityRepository } from '@mikro-orm/postgresql';
import Axios from 'axios';

import { DI } from '../server';
import { Estate } from '../entities';

const PAGESIZE = 20;
const SERVICE_URL = "https://www.sreality.cz/api/en/v2/estates";
const NO_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
const DEFAULT_PARAMS = {
  category_main_cb: 1,
  category_type_cb: 1,
  per_page: PAGESIZE
};

let scrapingInProgress = false;

interface SRealityEstate {
  name: string
  _links: SRealityLink
}

interface SRealityLink {
  images: Array<SRealityRef>
  image_middle2: Array<SRealityRef>
}

interface SRealityRef {
  href: string
}

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

  const cycleCount = recordCount / PAGESIZE
  let currentCycle = 0
  const em: SqlEntityManager = DI.orm.em as SqlEntityManager

  scrapingInProgress = true

  const saveData = (data: Array<SRealityEstate>) => {
    data?.forEach(e => {
      const name = e.name || "Untitled estate"
      const image = e._links?.image_middle2?.length ? e._links?.image_middle2[0].href : e._links?.images?.length ? e._links?.images[0].href : NO_IMAGE
      em.persist(new Estate(name, image))
    })
    return em.flush();
  }

  const setupNewRunOrExit = () => {
    if (currentCycle < cycleCount) {
      setTimeout(doScrape, delay);
    } else {
      scrapingInProgress = false;
      onComplete();
    }    
  }

  const handleError = (err: Error) => {
    console.log("error scraping the data", err);
    scrapingInProgress = false;
    onComplete();
}

  const doScrape = () => {
    if (!scrapingInProgress) return;
    Axios.get(SERVICE_URL, { params: { ...DEFAULT_PARAMS, page: currentCycle+1, tms: Date.now()}})
      .then(response => saveData(response.data._embedded?.estates))
      .then(() => onChange(currentCycle++, cycleCount))
      .then(() => setupNewRunOrExit())
      .catch((err: Error) => handleError(err))
  }

  em.createQueryBuilder(Estate).delete().execute()
    .then(() => doScrape());
}

/**
 * Stops the scraping process.
 */ 
export const stop = () => {
  scrapingInProgress = false
}

