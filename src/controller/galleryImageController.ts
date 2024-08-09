import { Request, Response } from 'express';
import GalleryImage from '../models/galleryImage';
import { put } from '@vercel/blob';

class GalleryImageController {
  async uploadToGallery(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { buffer, originalname } = req.file;
      const { url } = await put(`uploads/gallery/${Date.now()}-${originalname}`, buffer, {
        access: 'public',
      });

      await GalleryImage.create({ filename: originalname, url, userId: (req as any).user.id });

      res.status(200).json({ message: 'Image uploaded successfully to gallery', url });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading image', error });
    }
  }

  async getGalleryImage(req: Request, res: Response) {
    try {
      const images = await GalleryImage.findAll({ where: { userId: (req as any).user.id }, order: [['url', 'DESC']] });

      const fileUrls = images.map(img => img.url);

      res.status(200).send(fileUrls);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching images', error });
    }
  }
}

export default new GalleryImageController();
