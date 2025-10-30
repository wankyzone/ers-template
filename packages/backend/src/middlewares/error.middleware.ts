import type { NextFunction, Request, Response } from "express";

interface AppError {
	status?: number;
	message?: string;
}

export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void {
	console.error("Error:", err);

	const error = (
		typeof err === "object" && err !== null ? err : {}
	) as AppError;

	const status = error.status ?? 500;
	const message = error.message ?? "Internal server error";

	res.status(status).json({ error: message });
}
