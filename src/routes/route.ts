import { Router } from "express";
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import taskRoutes from './task.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/project', projectRoutes);
router.use('/task', taskRoutes);

export default router;