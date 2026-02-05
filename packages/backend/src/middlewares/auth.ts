import { Request, Response, NextFunction } from "express";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // mock auth for now
  req.user = {
    id: "mock-id",
    role: "runner",
  };

  next();
}
