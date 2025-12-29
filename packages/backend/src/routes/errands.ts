import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  createErrand,
  listErrands,
  acceptErrand,
  completeErrand,
} from "../controllers/errands.controller";

const router = Router();

router.post("/", requireAuth, createErrand);
router.get("/", requireAuth, listErrands);
router.post("/:id/accept", requireAuth, acceptErrand);
router.post("/:id/complete", requireAuth, completeErrand);

export default router;
