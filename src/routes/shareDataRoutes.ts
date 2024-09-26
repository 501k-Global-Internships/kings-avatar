import { Router } from 'express';
import ShareDataController from '../controller/ShareDataController';
import { verifyAuthToken, validateToken } from '../middlewares/userValidate';

const router = Router();

router.post('/share-data', verifyAuthToken, validateToken, ShareDataController.createShareData);
router.get('/share-data/:id', ShareDataController.getShareData);

export default router;
