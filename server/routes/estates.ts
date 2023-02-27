import { RequestHandler } from 'express';

import { isScraping, start, stop, findEstates } from '../services';
import { logger } from '../utils';

const DEFAULT_COUNT = 500
const DEFAULT_DELAY = 500
const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 10

let currentStatus = { running: false }

const scrapingEvents: Array<number> = [];

export const searchEstates: RequestHandler = (req, res) => {
  const offsetParam = parseInt(req.query.offset as string)
  const limitParam = parseInt(req.query.limit as string)
  findEstates(offsetParam || DEFAULT_OFFSET, limitParam || DEFAULT_LIMIT)
    .then(estates => res.status(200).json(estates));
}

export const startScraping: RequestHandler = (req, res) => {
  const countParam = parseInt(req.query.count as string)
  const delayParam = parseInt(req.query.delay as string)
  const onChange = (currentCycle: number, cycleCount: number) => {
    const progress = Math.floor((currentCycle+1)/cycleCount*100)
    currentStatus = { running: isScraping(), progress }
    scrapingEvents.push(progress);
  }

  start(countParam || DEFAULT_COUNT, delayParam || DEFAULT_DELAY, onChange, () => {});
  res.status(201).send();
};

export const getScraping: RequestHandler = (req, res) => {
  return res.status(200).json(currentStatus);
}

export const getScrapingStream: RequestHandler = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });

  let streamOpen = true
  req.on('close', () => streamOpen = false);

  const handleEvents = () => {
    while (scrapingEvents.length) {
      const data = scrapingEvents.shift();
      res.write(`event: scraping-progress\nid: ${Date.now()}\ndata: ${data}\n\n`);
    }  
    if (streamOpen) setTimeout(handleEvents, 500)
  }

  handleEvents();
};


export const stopScraping: RequestHandler = async (req, res) => {
  stop();
  return res.status(204).send();
};

