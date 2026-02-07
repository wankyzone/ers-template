"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
async function requireAuth(req, res, next) {
    // mock auth for now
    req.user = {
        id: "mock-id",
        role: "runner",
    };
    next();
}
