import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/validate";
import {
  createErrand,
  getClientErrands
} from "../controllers/errands.controller";
import {
  acceptErrand,
  startErrand,
  completeErrand,
} from "../controllers/errands.controller";
import {
  createErrandSchema,
  updateErrandParamsSchema,
} from "../schemas/errand.schema"


const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("client"),
  validate(createErrandSchema),
  createErrand
);

router.get(
  "/my",
  requireAuth,
  requireRole("client"),
  getClientErrands
);

router.post(
  "/:id/accept",
  requireAuth,
  requireRole("runner"),
  validate(updateErrandParamsSchema, "params"),
  acceptErrand
);

router.post(
  "/:id/start",
  requireAuth,
  requireRole("runner"),
  startErrand
);

router.post(
  "/:id/complete",
  requireAuth,
  requireRole("runner"),
  completeErrand
);


requireRole("admin")


export default router;