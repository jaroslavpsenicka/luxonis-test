import { Router } from 'express';

import { searchEstates, startScraping, getScrapingStream, stopScraping } from './estates'

const router = Router();

router.get('/api/estates', searchEstates);
router.get('/api/scraping', getScrapingStream);
router.post('/api/scraping', startScraping);
router.delete('/api/scraping', stopScraping);

export default router;