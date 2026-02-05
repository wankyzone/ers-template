import { RequestHandler } from "express";

export const requestLogger: RequestHandler = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    const { method, originalUrl } = req;
    console.log(
      `[${new Date().toISOString()}] ${method} ${originalUrl} ${res.statusCode} - ${ms}ms`
    );
  });

  next();
};
