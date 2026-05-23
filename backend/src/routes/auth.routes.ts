import { Router } from "express";
import { getMe, login, signup } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { LoginSchema, SignupSchema } from "../models/auth.model";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", validate(LoginSchema), asyncHandler(login));
router.post("/signup", validate(SignupSchema), asyncHandler(signup));
router.get("/me", requireAuth, asyncHandler(getMe));

export default router;
