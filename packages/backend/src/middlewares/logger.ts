import type { RequestHandler } from "express";

/**
 * Simple HTTP request logger middleware.
 * Logs method, url, statusCode, duration, ip.
 */
export const requestLogger: RequestHandler = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    const method = req.method;
    const url = req.originalUrl ?? req.url;
    const status = res.statusCode;
    const ip =
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "unknown";

    console.log(
      `[${new Date().toISOString()}] ${method} ${url} ${status} - ${ms}ms - ${ip}`
    );
  });

  next();
};
