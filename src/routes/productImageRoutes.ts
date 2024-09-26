import { Router } from "express";
import multer from "multer";
import projectImageController from "../controller/projectImageController";
import { verifyAuthToken, validateToken } from "../middlewares/userValidate";

const router = Router();

const storage = multer.memoryStorage(); // Use memory storage as images are uploaded to Vercel Blob
const upload = multer({ storage });

router.post('/upload/projects', verifyAuthToken, validateToken, upload.single('image'), projectImageController.uploadToProject);
router.get('/upload/projects', verifyAuthToken, validateToken, projectImageController.getProjectImage);

export default router;
