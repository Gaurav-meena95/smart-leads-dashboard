import express from 'express';
import { createLead, updateLead, deleteLead, allLeads, exportCSV } from './leadController';
import { verifyUserMiddleware } from '../middleware';

const router = express.Router();

router.use(verifyUserMiddleware);

router.get('/', allLeads);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);
router.get('/export/csv', exportCSV);

export default router;
