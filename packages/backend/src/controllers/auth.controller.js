"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const supabase_1 = require("../config/supabase");
const supabaseAdmin_1 = require("../config/supabaseAdmin");
const audit_service_1 = require("../services/audit.service");
const AppError_1 = require("../utils/AppError");
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { data, error } = await supabase_1.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            return next(new AppError_1.AppError(error.message, 401));
        }
        await supabaseAdmin_1.supabaseAdmin.from("profiles").upsert({
            id: data.user.id,
            email: data.user.email,
            role: "client",
        });
        await (0, audit_service_1.logAuditEvent)({
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
    }
    catch (err) {
        next(err); // 👈 THIS is what prevents crashes
    }
};
exports.login = login;
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const { data, error } = await supabase_1.supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            return next(new AppError_1.AppError(error.message, 400));
        }
        await supabaseAdmin_1.supabaseAdmin.from("profiles").upsert({
            id: data.user?.id,
            email,
            role: "client",
        });
        await (0, audit_service_1.logAuditEvent)({
            actorId: data.user?.id,
            actorRole: "client",
            action: "USER_REGISTERED",
            entity: "auth",
        });
        res.status(201).json({
            message: "User registered",
            user: data.user,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
