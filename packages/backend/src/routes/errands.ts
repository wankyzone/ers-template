import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/validate";

import {
  createErrand,
  getClientErrands,
  acceptErrand,
  startErrand,
  completeErrand,
} from "../controllers/errands.controller";

import { getAvailableErrandsForRunner } from "../controllers/errands.controller";

import {
  createErrandSchema,
  updateErrandParamsSchema,
} from "../schemas/errand.schema";
import { getAvailableErrandsForRunnerService } from "../services/errand.service";

const router = Router();

/* CLIENT */
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

/* RUNNER */
router.get(
  "/available",
  getAvailableErrandsForRunner
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

router.get("/available", async (req, res, next) => {
  try {
    const runnerId = req.get("x-runner-id");
    if (!runnerId) {
      return res.status(400).json({ error: "x-runner-id required" });
    }

    const errands = await getAvailableErrandsForRunnerService(runnerId);
    res.json({ errands });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, requireRole("client"), createErrand);

export default router;
