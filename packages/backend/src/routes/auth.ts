import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { requireAuth} from "../middlewares/auth.middleware";
import { AuthenticatedRequest } from "../types/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", requireAuth, (req, res) => {
    const authReq = req as AuthenticatedRequest;
    res.json({ user: authReq.user});
});

export default router;
