import { RequestHandler } from "express";

export const requireRole = (
  role: "client" | "runner" | "admin"
): RequestHandler => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};
