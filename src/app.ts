import express from 'express';
import path from 'path';
import cors from 'cors'
import GalleryImage from './models/galleryImage';
import ProjectImage from './models/projectImage';
import User from './models/user';
import sequelize from './config/database';
import routes from './routes/routes';

const app = express();
const port = 5000;

app.use('/uploads/gallery', express.static(path.join(__dirname, 'uploads/gallery')));
app.use('/uploads/projects', express.static(path.join(__dirname, 'uploads/projects')));

const corsOptions = {
  origin: [
    'http://localhost:3000',
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

routes(app);

async function startServer() {
  try {
    const models = {
      User,
      GalleryImage,
      ProjectImage
    };

    Object.values(models).forEach((model) => {
      if (model.associate) {
        model.associate(models);
      }
    });

    await sequelize.authenticate();
    console.log('Connected to database');

    await sequelize.sync();
    console.log('Database & tables synchronized.');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
