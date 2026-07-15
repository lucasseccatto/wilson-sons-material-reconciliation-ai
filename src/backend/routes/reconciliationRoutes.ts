import { Router } from 'express';
import { ReconciliationController } from '../controllers/reconciliationController';
import { fileUpload } from '../middlewares/uploadMiddleware';

const router = Router();

// Endpoint to upload and parse Excel Jobbook
router.post(
  '/upload',
  fileUpload.single('jobbook'),
  ReconciliationController.uploadJobbook
);

// Endpoint to analyze Drawing (PDF/Image) and reconcile it with the Jobbook (Excel)
router.post(
  '/analyze',
  fileUpload.fields([
    { name: 'drawing', maxCount: 1 },
    { name: 'jobbook', maxCount: 1 }
  ]),
  ReconciliationController.analyzeReconciliation
);

// Endpoint to get the latest generated reconciliation report
router.get('/report', ReconciliationController.getLatestReport);

export default router;
