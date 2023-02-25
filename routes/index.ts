import { Router } from 'express';

import { searchEstates, startScraping, stopScraping } from './estates'

const router = Router();

router.get('/api/estates', searchEstates);
router.post('/api/scraping', startScraping);
router.delete('/api/scraping', stopScraping);

export default router;