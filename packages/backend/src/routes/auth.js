"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_1 = require("../middlewares/validate");
const auth_schema_1 = require("../schemas/auth.schema");
const auth_1 = require("../middlewares/auth");
const rateLimit_1 = require("../middlewares/rateLimit");
const router = (0, express_1.Router)();
router.post("/register", rateLimit_1.authRateLimiter, (0, validate_1.validate)(auth_schema_1.registerSchema), auth_controller_1.register);
router.post("/login", rateLimit_1.authRateLimiter, (0, validate_1.validate)(auth_schema_1.loginSchema), auth_controller_1.login);
router.get("/me", auth_1.requireAuth, (req, res) => {
    res.json({ user: req.User });
});
exports.default = router;
