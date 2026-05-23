import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { ApiError, ValidationErrorItem } from "../utils/apiError";

type ErrorResponse = {
  success: false;
  message: string;
  errors?: ValidationErrorItem[];
  stack?: string;
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: ValidationErrorItem[] | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 422;
    message = "Validation failed";
    errors = err.issues.map((issue: ZodIssue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  } else if (isMysqlError(err)) {
    switch (err.code) {
      case "ER_DUP_ENTRY":
        statusCode = 409;
        message = "Unique constraint violation";
        errors = [{ field: "unique", message: err.message ?? "Already exists" }];
        break;
      case "ER_NO_REFERENCED_ROW_2":
      case "ER_ROW_IS_REFERENCED_2":
        statusCode = 400;
        message = "Foreign key constraint failed";
        break;
      case "ER_LOCK_DEADLOCK":
      case "ER_LOCK_WAIT_TIMEOUT":
        statusCode = 409;
        message = "Transaction conflict, please retry";
        break;
      case "ER_BAD_NULL_ERROR":
        statusCode = 400;
        message = "Missing required data";
        break;
      default:
        statusCode = 500;
        message = "Database error";
    }
  } else if (err instanceof Error) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Invalid authentication token";
    } else {
      message = err.message || message;
    }
  }

  if (statusCode >= 500) {
    logger.error(message, { err });
  }

  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (env.NODE_ENV !== "production" && err instanceof Error) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

type MysqlError = {
  code?: string;
  errno?: number;
  sqlState?: string;
  sqlMessage?: string;
  message?: string;
};

const isMysqlError = (error: unknown): error is MysqlError => {
  if (!error || typeof error !== "object") return false;
  return "code" in error || "errno" in error;
};
