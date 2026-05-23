import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodIssue } from "zod";
import { ApiError, ValidationErrorItem } from "../utils/apiError";

type ValidationTarget = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, target: ValidationTarget = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (result.success) {
      // Avoid setting req.query directly as it's a getter in Express
      if (target === "query") {
        Object.assign(req.query, result.data);
      } else {
        req[target] = result.data;
      }
      return next();
    }

    const errors: ValidationErrorItem[] = result.error.issues.map((issue: ZodIssue) => ({
      field: issue.path.join(".") || target,
      message: issue.message,
    }));

    return next(new ApiError(422, "Validation failed", true, errors));
  };
