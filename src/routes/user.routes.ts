import { Router } from "express";
import { RegisterRequest } from "../app/http/requests/auth/register.request";
import { UserController } from "app/http/controllers/UserController";

const router = Router();

router.post('/get-all-members', UserController.getAllMembers);

export default router;