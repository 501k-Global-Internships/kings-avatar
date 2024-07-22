import { Request, Response } from 'express';
import { put } from '@vercel/blob';
import ProjectImage from '../models/projectImage';

class ProjectImageController {
  async uploadToProject(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { url } = await put(`uploads/projects/${Date.now()}-${req.file.originalname}`, req.file.buffer, { access: 'public' });

      await ProjectImage.create({ filename: req.file.originalname, url, userId: (req as any).user.id });

      res.status(200).json({ message: 'Image uploaded successfully to projects', imageUrl: url });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading image', error });
    }
  }

  async getProjectImage(req: Request, res: Response) {
    try {
      const images = await ProjectImage.findAll({ where: { userId: (req as any).user.id } });

      const fileUrls = images.map(img => img.url);

      res.status(200).send(fileUrls);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching images', error });
    }
  }
}

export default new ProjectImageController();
