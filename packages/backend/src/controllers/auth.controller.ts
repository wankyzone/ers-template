import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../utils/supabase";
import { supabaseAdmin } from "../utils/supabaseAdmin";

export const register = async (req: Request, res: Response) => {
  console.log("REGISTER BODY:", req.body);
    
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // create profile
  await supabase.from("users").insert({
    id: data.user?.id,
    email,
    name,
  });

  res.status(201).json({
    message: "User registered",
    user: data.user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password required",
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({
      error: error.message,
    });
  }

  return res.json({
    accessToken: data.session?.access_token,
    refreshToken: data.session?.refresh_token,
    user: data.user,
  });

  await supabaseAdmin.from("profiles").upsert({
    id: data.user.id,
    email: data.user.email,
    role: "client",
  });
};
