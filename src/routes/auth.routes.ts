import { Router } from "express";
import { RegisterRequest } from "../app/http/requests/auth/register.request";
import { login, register } from "../app/http/controllers/auth.controller.js";
import { LoginRequest } from "../app/http/requests/auth/login.request.js";

const router = Router();

router.post('/register', RegisterRequest, register);
router.post('/login', LoginRequest, login);

export default router;