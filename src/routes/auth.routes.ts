import { Router } from "express";
import { RegisterRequest } from "../app/http/requests/auth/register.request.js";
import { LoginRequest } from "../app/http/requests/auth/login.request.js";
import { AuthController } from "../app/http/controllers/AuthController.js";
import { authenticate } from "../app/http/middlewares/authenticate.js";

const router = Router();

router.post('/register', RegisterRequest, AuthController.register);
router.post('/login', LoginRequest, AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', authenticate, AuthController.logout);


export default router;