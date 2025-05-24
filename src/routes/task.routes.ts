import { Role } from "@prisma/client";
import { TaskController } from "app/http/controllers/TaskController";
import { authenticate } from "app/http/middlewares/authenticate";
import { authorize } from "app/http/middlewares/authorize";
import { CreateCommentRequest } from "app/http/requests/comments/create.request";
import { UpdateCommentRequest } from "app/http/requests/comments/update.request";
import { CreateTaskRequest } from "app/http/requests/tasks/create.request";
import { UpdateTaskRequest } from "app/http/requests/tasks/update.request";
import { Router } from "express";

const router = Router();

// Task filter and search
router.get('/tasks/search', authenticate, TaskController.search);
router.get('/tasks/filter', authenticate, TaskController.filter);

router.post('/:id/tasks', CreateTaskRequest, authenticate, authorize([Role.ADMIN, Role.MEMBER]), TaskController.create);
router.get('/:id/tasks', authenticate, authorize([Role.ADMIN, Role.MEMBER]), TaskController.index);
router.get('/:id/tasks/:taskId', authenticate, authorize([Role.ADMIN, Role.MEMBER]), TaskController.show);
router.put('/:id/tasks/:taskId', UpdateTaskRequest, authenticate, authorize([Role.ADMIN, Role.MEMBER]), TaskController.update);
router.delete('/:id/tasks/:taskId', authenticate, authorize([Role.ADMIN]), TaskController.delete);

router.post('/:id/tasks/:taskId/comments', CreateCommentRequest, authenticate, authorize([Role.ADMIN, Role.MEMBER]), TaskController.addComment);
router.get('/:id/tasks/:taskId/comments', authenticate, authorize([Role.ADMIN, Role.MEMBER]), TaskController.getComments);
router.put('/:id/tasks/:taskId/comments/:commentId', UpdateCommentRequest, authenticate, authorize([Role.ADMIN, Role.MEMBER]), TaskController.updateComment);
router.delete('/:id/tasks/:taskId/comments/:commentId', authenticate, authorize([Role.ADMIN, Role.MEMBER]), TaskController.destroyComment);

export default router;