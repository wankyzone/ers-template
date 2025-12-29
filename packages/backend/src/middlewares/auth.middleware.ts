import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/auth";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: "No token provided" });
    }

    const [, token] = header.split(" ");
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as any,
    };

    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
