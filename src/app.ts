import express from 'express';
import path from 'path';
import cors from 'cors';
import GalleryImage from './models/galleryImage';
import ProjectImage from './models/projectImage';
import User from './models/user';
import sequelize from './config/database';
import routes from './routes/routes';

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ['http://localhost:3000', 'https://kings-avatar.netlify.app', 'https://kings-avatar-fe.netlify.app'],
  credentials: true,
};

app.use(cors(corsOptions));

const addCORSHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Origin', 'https://kings-avatar.netlify.app');
  res.setHeader('Access-Control-Allow-Origin', 'https://kings-avatar-fe.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
};

app.use('/uploads/gallery', addCORSHeaders, express.static(path.join('/var/data/uploads/gallery')));
app.use('/uploads/projects', addCORSHeaders, express.static(path.join('/var/data/uploads/projects')));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Add a homepage route
app.get('/', (req, res) => {
  res.send('Welcome To Kings Avatar App');
});

routes(app);

async function startServer() {
  try {
    const models = {
      User,
      GalleryImage,
      ProjectImage,
    };

    Object.values(models).forEach((model) => {
      if (model.associate) {
        model.associate(models);
      }
    });

    await sequelize.authenticate();
    console.log('Connected to database');

    await sequelize.sync({ alter: true });
    console.log('Database & tables synchronized.');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
