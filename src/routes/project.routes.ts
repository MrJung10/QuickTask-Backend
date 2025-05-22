import { ProjectController } from "app/http/controllers/ProjectController";
import { authenticate } from "app/http/middlewares/authenticate";
import { authorize } from "app/http/middlewares/authorize";
import { requireProjectRole } from "app/http/middlewares/authorize-project-roles";
import { CreateProjectRequest } from "app/http/requests/projects/create.request";
import { InviteProjectMembersRequest } from "app/http/requests/projects/invite.request";
import { UpdateProjectRequest } from "app/http/requests/projects/update.request";
import { Router } from "express";

const router = Router();

router.get('/', authenticate, ProjectController.index);
router.post('/', CreateProjectRequest, authenticate, authorize(['ADMIN']), ProjectController.create);
router.put('/:id', UpdateProjectRequest, authenticate, requireProjectRole(['ADMIN']), ProjectController.update);
router.delete('/:id', authenticate, ProjectController.delete);

router.post('/:id/invite', InviteProjectMembersRequest, authenticate, requireProjectRole(['ADMIN']), ProjectController.inviteMembers);


export default router;