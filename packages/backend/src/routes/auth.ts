import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../utils/supabase";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
	try {
		const { email, password, name } = req.body;
		if (!email || !password)
			return res.status(400).json({ error: "Email and password required" });

		const hashed = await bcrypt.hash(password, 10);
		const { data, error } = await supabase
			.from("users")
			.insert([{ email, password: hashed, name }])
			.select()
			.single();

		if (error) throw error;
		res.status(201).json({ message: "User created successfully", user: data });
	} catch (err: any) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

// Login
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password)
			return res.status(400).json({ error: "Email and password required" });

		const { data: user, error } = await supabase
			.from("users")
			.select("*")
			.eq("email", email)
			.single();

		if (error || !user)
			return res.status(401).json({ error: "Invalid credentials" });

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) return res.status(401).json({ error: "Invalid credentials" });

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET!,
			{
				expiresIn: "7d",
			},
		);

		res.json({ message: "Login successful", token, user });
	} catch (err: any) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

export default router;
