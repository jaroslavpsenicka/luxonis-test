import { RequestHandler } from 'express';

import { isScraping, start, stop, findEstates } from '../services';
import { logger } from '../utils';

const DEFAULT_COUNT = 500
const DEFAULT_DELAY = 500

export const searchEstates: RequestHandler = (req, res) => findEstates().then(estates => res.status(200).json(estates));

export const startScraping: RequestHandler = async (req, res) => {
  const countParam = parseInt(req.query.c as string)
  const delayParam = parseInt(req.query.d as string)
  const progressFn = (currentCycle: number, cycleCount: number) => {
    console.log(`cycle ${currentCycle+1} of ${cycleCount}`)
    return true;
  }

  try {
    const recordCount = !isNaN(countParam) ? countParam : DEFAULT_COUNT
    const scrapeDelay = !isNaN(delayParam) ? delayParam : DEFAULT_DELAY
    start(recordCount, scrapeDelay, progressFn)    
    res.status(201).send();
  } catch (err) {
    logger.error("cannot start scraping,", err)
    res.status(400).send({ error: (err instanceof Error) ? err.message : err?.toString() });
  }
};

export const stopScraping: RequestHandler = async (req, res) => {
  if (!isScraping()) {
    return res.status(400).send({ error: "scraping is not active" });
  } else {
    stop();
    return res.status(204).send();
  }
};

