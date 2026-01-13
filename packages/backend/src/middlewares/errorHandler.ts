import { AppError } from "../utils/AppError";

export function errorHandler(err, _req, res, _next) {
  console.error("GLOBAL ERROR:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal server error" });
}
