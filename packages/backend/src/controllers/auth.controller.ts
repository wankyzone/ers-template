import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { supabaseAdmin } from "../config/supabaseAdmin";
import { logAuditEvent } from "../services/audit.service";
import { AppError } from "../utils/AppError";


export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return next(new AppError(error.message, 401));
    }

    await supabaseAdmin.from("profiles").upsert({
      id: data.user.id,
      email: data.user.email,
      role: "client",
    });

    await logAuditEvent({
      actorId: data.user.id,
      actorRole: "client",
      action: "USER_LOGGED_IN",
      entity: "auth",
    });

    res.json({
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      user: data.user,
    });
  } catch (err) {
    next(err); // 👈 THIS is what prevents crashes
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return next(new AppError(error.message, 400));
    }

    await supabaseAdmin.from("profiles").upsert({
      id: data.user?.id,
      email,
      role: "client",
    });

    await logAuditEvent({
      actorId: data.user?.id,
      actorRole: "client",
      action: "USER_REGISTERED",
      entity: "auth",
    });

    res.status(201).json({
      message: "User registered",
      user: data.user,
    });
  } catch (err) {
    next(err);
  }
};