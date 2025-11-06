import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../utils/supabaseClient";

export class AuthService {
  static async signup({ email, password }: { email: string; password: string }) {
    const hash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from("users").insert([{ email, password: hash }]).select();

    if (error) throw new Error(error.message);
    return data[0];
  }

  static async login({ email, password }: { email: string; password: string }) {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single();
    if (error || !data) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, data.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return { token, user: { id: data.id, email: data.email } };
  }
}
