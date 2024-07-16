import { Application } from "express";
import userRoutes from "./userRoutes";
import  galleryImageRoutes  from "./galleryImageRoutes";
import  projectImageRoutes  from "./productImageRoutes";

export default function routes(app:Application) {
  app.use('/api/users', userRoutes)
  app.use('', galleryImageRoutes)
  app.use('', projectImageRoutes)
}