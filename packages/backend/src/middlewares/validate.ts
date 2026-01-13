import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema, property: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid request data",
        details: result.error.flatten(),
      });
    }

    // overwrite with validated data
    req[property] = result.data;
    next();
  };
