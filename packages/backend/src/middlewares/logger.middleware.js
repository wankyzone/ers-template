"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const ms = Date.now() - start;
        const { method, originalUrl } = req;
        console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} ${res.statusCode} - ${ms}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
