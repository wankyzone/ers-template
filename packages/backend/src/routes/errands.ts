import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  createErrand,
  acceptErrand,
  startErrand,
  completeErrand,
} from "../controllers/errands.controller";
import { requireRole } from "../middlewares/requireRole.middleware";
import { AuthenticatedRequest } from "../types/auth";
import { getClientErrands } from "../controllers/errands.controller";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("client"),
  createErrand
);

router.post("/:id/accept", requireAuth, requireRole("runner"), acceptErrand);
router.post("/:id/start", requireAuth, requireRole("runner"), startErrand);
router.post("/:id/complete", requireAuth, requireRole("runner"), completeErrand);


router.get(
  "/",
  requireAuth,
  requireRole("client"),
  getClientErrands
);

export default router;