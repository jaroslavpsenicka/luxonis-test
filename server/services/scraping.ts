import assert from 'assert'

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
export const start = (recordCount: number, delay: number, progressFn: (currentCycle: number, cycleCount: number) => boolean) => {
  assert(recordCount > 0 && recordCount <= 1000, "u crazy?");
  assert(delay > 0, "be gentle to the service");
  assert(scrapingInProgress === false, "scraping is already running, wait until completed or call stop()");

  scrapingInProgress = true

  const cycleCount = recordCount / 20
  let currentCycle = 0
  const doScrape = () => {
    if (!scrapingInProgress) return;

    const cont = progressFn(currentCycle++, cycleCount);
    if (cont && currentCycle < cycleCount) {
      setTimeout(doScrape, delay);
    } else {
      scrapingInProgress = false;
    }
  }

  doScrape()
}

/**
 * Stops the scraping process.
 */ 
export const stop = () => {
  scrapingInProgress = false
}

