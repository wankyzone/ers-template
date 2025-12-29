import { Request } from "express";
import { UserRole } from "./users";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}
