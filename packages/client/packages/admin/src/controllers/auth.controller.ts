import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { success, fail } from "../utils/response";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.signup(req.body);
    return success(res, "Signup successful", result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.login(req.body);
    return success(res, "Login successful", result);
  } catch (err) {
    next(err);
  }
}
