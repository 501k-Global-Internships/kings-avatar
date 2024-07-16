import { Request, Response } from 'express';
import GalleryImage from '../models/galleryImage';

class GalleryImageController {
  async uploadToGallery(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/gallery/${req.file?.filename}`;

      await GalleryImage.create({ filename: req.file?.filename, userId: (req as any).user.id });

      res.status(200).json({ message: 'Image uploaded successfully to gallery', imageUrl });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading image', error });
    }
  }

  async getGalleryImage(req: Request, res: Response) {
    try {
      const images = await GalleryImage.findAll({ where: { userId: (req as any).user.id } });

      const fileUrls = images.map(img => `${req.protocol}://${req.get('host')}/uploads/gallery/${img.filename}`);

      res.status(200).send(fileUrls);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching images', error });
    }
  }
}

export default new GalleryImageController();
