import { Router, Request, Response, IRouter } from 'express';
import { instanceAuth } from '../middleware/instanceAuth';
import { generateSignedUploadParams } from '../services/cloudinary.service';

const router: IRouter = Router();

// POST /api/upload/sign  — returns signed Cloudinary upload params
// Mounted at /api/upload, so path is /sign
router.post('/sign', instanceAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { folder } = req.body as { folder: string };

    if (!folder) {
      res.status(400).json({ error: 'folder is required' });
      return;
    }

    const params = generateSignedUploadParams(folder);
    res.json(params);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

export default router;
