import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/users";

export const requireRole =
  (roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ error: "Unauthorized" });

    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden" });

    next();
  };
