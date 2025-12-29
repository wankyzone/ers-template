// src/middlewares/logger.middleware.ts
import { RequestHandler } from "express";

export const requestLogger: RequestHandler = (req, _res, next) => {
  const start = Date.now();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${method} ${url} ${res.statusCode} - ${ms}ms - ${ip}`);
  });
  next();
};
