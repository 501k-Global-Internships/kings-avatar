import { Request, Response } from 'express';
import ShareData from '../models/ShareData';
import { put } from '@vercel/blob';
import { Buffer } from 'buffer';

class ShareDataController {
  async createShareData(req: Request, res: Response) {
    try {
      const { image, framesData } = req.body;
      
      if (!image) {
        return res.status(400).json({ message: 'No image data provided' });
      }

      const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const filename = `${Date.now()}.jpg`;
      const filePath = `uploads/share-image/${filename}`;

      const { url } = await put(filePath, buffer, {
        access: 'public',
      });

     const data = await ShareData.create({ 
        imageUrl: url, 
        userId: (req as any).user.id, 
        framesData 
      });

      res.status(200).json({ message: 'Data uploaded successfully', data });
    } catch (error: any) {
      console.error('Error uploading data:', error);
      res.status(500).json({ message: 'Error uploading data', error: error.message || error });
    }
  }

  async getShareData(req: Request, res: Response) {
    try {
      const data = await ShareData.findOne({ where: { id: req.params.id } });
      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }

      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching data', error: error.message || error });
    }
  }
}

export default new ShareDataController();
