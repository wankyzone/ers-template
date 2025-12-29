import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

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

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ error: err?.message ?? "Internal server error" });
}