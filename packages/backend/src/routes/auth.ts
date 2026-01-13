import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { requireAuth} from "../middlewares/auth";
import { authRateLimiter } from "../middlewares/rateLimit";

const router = Router();


router.post(
    "/register",
    authRateLimiter,                                        
    validate(registerSchema),
     register
);

router.post(
    "/login",
    authRateLimiter,
    validate(loginSchema),
     login
);

router.get("/me", requireAuth, (req, res) => {
    res.json({ user: (req as any).User });
});

export default router;
