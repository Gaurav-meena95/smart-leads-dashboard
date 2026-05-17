import express from 'express';
import { createLead, getLeadById, updateLead, deleteLead, allLeads, exportCSV } from './leadController';
import { verifyUserMiddleware } from '../middleware';

const router = express.Router();

router.use(verifyUserMiddleware);

router.get('/', allLeads);
router.get('/export/csv', exportCSV);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
