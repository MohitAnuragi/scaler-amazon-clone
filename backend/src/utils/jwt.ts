import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

export const signAccessToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload & AuthTokenPayload;
