"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
/**
 * Simple HTTP request logger middleware.
 * Logs method, url, statusCode, duration, ip.
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const ms = Date.now() - start;
        const method = req.method;
        const url = req.originalUrl ?? req.url;
        const status = res.statusCode;
        const ip = req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            "unknown";
        console.log(`[${new Date().toISOString()}] ${method} ${url} ${status} - ${ms}ms - ${ip}`);
    });
    next();
};
exports.requestLogger = requestLogger;
