"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const email = zod_1.z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address");
exports.registerSchema = zod_1.z.object({
    email,
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password too long"),
    name: zod_1.z.string().trim().min(1, "Name is required"),
});
exports.loginSchema = zod_1.z.object({
    email,
    password: zod_1.z.string().min(1, "Password is required"),
});
