import { Router } from 'express';
import { getLeads, createLead, updateLead, deleteLead, exportLeadsCsv } from '../controllers/lead.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(protect); // All lead routes are protected

router.route('/')
  .get(getLeads)
  .post(requireRole('admin', 'sales'), createLead);

router.get('/export/csv', requireRole('admin', 'sales'), exportLeadsCsv);

router.route('/:id')
  .put(requireRole('admin', 'sales'), updateLead)
  .delete(requireRole('admin'), deleteLead);

export default router;
