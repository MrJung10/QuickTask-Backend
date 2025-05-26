import { ProjectController } from "../app/http/controllers/ProjectController.js";
import { authenticate } from "../app/http/middlewares/authenticate.js";
import { authorize } from "../app/http/middlewares/authorize.js";
import { requireProjectRole } from "../app/http/middlewares/authorize-project-roles.js";
import { CreateProjectRequest } from "../app/http/requests/projects/create.request.js";
import { InviteProjectMembersRequest } from "../app/http/requests/projects/invite.request.js";
import { UpdateProjectRequest } from "../app/http/requests/projects/update.request.js";
import { Router } from "express";

const router = Router();

router.get('/', authenticate, ProjectController.index);
router.get('/:id', authenticate, ProjectController.details);
router.post('/', CreateProjectRequest, authenticate, authorize(['ADMIN']), ProjectController.create);
router.put('/:id', UpdateProjectRequest, authenticate, requireProjectRole(['ADMIN']), ProjectController.update);
router.delete('/:id', authenticate, ProjectController.delete);

router.post('/:id/invite', InviteProjectMembersRequest, authenticate, requireProjectRole(['ADMIN']), ProjectController.inviteMembers);


export default router;