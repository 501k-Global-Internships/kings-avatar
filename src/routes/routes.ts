import { Application } from "express";
import userRoutes from "./userRoutes";
import  galleryImageRoutes  from "./galleryImageRoutes";
import  projectImageRoutes  from "./productImageRoutes";
import  shareDataRoutes  from "./shareDataRoutes";

export default function routes(app:Application) {
  app.use('/api/users', userRoutes)
  app.use('/api', galleryImageRoutes)
  app.use('/api', projectImageRoutes)
  app.use('/api', shareDataRoutes)
}