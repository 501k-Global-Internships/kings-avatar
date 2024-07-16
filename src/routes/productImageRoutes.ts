import { Router } from "express";
import multer from "multer";
import fs from 'fs';
import path from "path";
import projectImageController from "../controller/projectImageController";
import { verifyAuthToken, validateToken } from "../middlewares/userValidate";

const router = Router()

const ensureDirectoryExistence = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.url.includes('gallery') ? '/uploads/gallery' : '/uploads/projects';
    const uploadPath = path.join(__dirname, '..', folder);
    ensureDirectoryExistence(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/upload/projects', verifyAuthToken, validateToken, upload.single('image'), projectImageController.uploadToProject);
router.get('/upload/projects', verifyAuthToken, validateToken, projectImageController.getProjectImage);

export default router;