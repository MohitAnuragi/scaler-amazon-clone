import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { verifyAccessToken } from "../utils/jwt";

const getBearerToken = (req: Request) => {
  const header = req.header("authorization") || req.header("Authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
};

export const extractUser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = getBearerToken(req);
    if (!token) return next();

    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (error) {
    return next(error);
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  extractUser(req, res, (error?: any) => {
    if (error) return next(error);
    if (!req.user?.id) return next(new ApiError(401, "Authentication required"));
    return next();
  });
};
