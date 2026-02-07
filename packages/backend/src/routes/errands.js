"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const requireRole_1 = require("../middlewares/requireRole");
const validate_1 = require("../middlewares/validate");
const errands_controller_1 = require("../controllers/errands.controller");
const errands_controller_2 = require("../controllers/errands.controller");
const errand_schema_1 = require("../schemas/errand.schema");
const errand_service_1 = require("../services/errand.service");
const router = (0, express_1.Router)();
/* CLIENT */
router.post("/", auth_1.requireAuth, (0, requireRole_1.requireRole)("client"), (0, validate_1.validate)(errand_schema_1.createErrandSchema), errands_controller_1.createErrand);
router.get("/my", auth_1.requireAuth, (0, requireRole_1.requireRole)("client"), errands_controller_1.getClientErrands);
/* RUNNER */
router.get("/available", errands_controller_2.getAvailableErrandsForRunner);
router.post("/:id/accept", auth_1.requireAuth, (0, requireRole_1.requireRole)("runner"), (0, validate_1.validate)(errand_schema_1.updateErrandParamsSchema, "params"), errands_controller_1.acceptErrand);
router.post("/:id/start", auth_1.requireAuth, (0, requireRole_1.requireRole)("runner"), errands_controller_1.startErrand);
router.post("/:id/complete", auth_1.requireAuth, (0, requireRole_1.requireRole)("runner"), errands_controller_1.completeErrand);
router.get("/available", async (req, res, next) => {
    try {
        const runnerId = req.get("x-runner-id");
        if (!runnerId) {
            return res.status(400).json({ error: "x-runner-id required" });
        }
        const errands = await (0, errand_service_1.getAvailableErrandsForRunnerService)(runnerId);
        res.json({ errands });
    }
    catch (err) {
        next(err);
    }
});
router.post("/", auth_1.requireAuth, (0, requireRole_1.requireRole)("client"), errands_controller_1.createErrand);
exports.default = router;
