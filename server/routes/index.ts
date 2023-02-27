import { Router } from 'express';

import { searchEstates, startScraping, getScraping, getScrapingStream, stopScraping } from './estates'

const router = Router();

router.get('/api/estates', searchEstates);
router.get('/api/scraping', getScraping);
router.get('/api/scraping/events', getScrapingStream);
router.post('/api/scraping', startScraping);
router.delete('/api/scraping', stopScraping);

export default router;