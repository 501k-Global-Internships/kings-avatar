import { Router } from "express";
import multer from "multer";
import fs from 'fs';
import galleryImageController from "../controller/galleryImageController";
import { verifyAuthToken, validateToken } from "../middlewares/userValidate";

const router = Router()

const ensureDirectoryExistence = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.url.includes('gallery') ? '/var/data/uploads/gallery' : '/var/data/uploads/projects';
    ensureDirectoryExistence(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

  router.post('/upload/gallery', verifyAuthToken, validateToken, upload.single('image'), galleryImageController.uploadToGallery);
  router.get('/upload/gallery', verifyAuthToken, validateToken, galleryImageController.getGalleryImage);

export default router;