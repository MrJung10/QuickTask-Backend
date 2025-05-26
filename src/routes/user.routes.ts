import { Router } from "express";
import { UserController } from "../app/http/controllers/UserController.js";

const router = Router();

router.get('/get-all-members', UserController.getAllMembers);

export default router;