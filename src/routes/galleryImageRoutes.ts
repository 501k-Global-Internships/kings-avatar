import { Router } from 'express';
import multer from 'multer';
import galleryImageController from '../controller/galleryImageController';
import { verifyAuthToken, validateToken } from '../middlewares/userValidate';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload/gallery', verifyAuthToken, validateToken, upload.single('image'), galleryImageController.uploadToGallery);
router.get('/upload/gallery', verifyAuthToken, validateToken, galleryImageController.getGalleryImage);

export default router;
