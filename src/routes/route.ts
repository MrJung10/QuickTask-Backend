import { Router } from "express";
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import taskRoutes from './task.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/project', projectRoutes);
router.use('/projects', taskRoutes);
router.use('/user', userRoutes);

export default router;