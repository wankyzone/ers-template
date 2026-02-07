"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: "Validation error",
            details: err.issues.map((e) => ({
                path: e.path.join("."),
                message: e.message,
            })),
        });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
}
