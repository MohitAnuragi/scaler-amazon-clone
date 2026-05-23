import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request } from "express";

const keyByUserOrIp = (req: Request): string => {
  // Use user ID if available, otherwise use IP
  if (req.user?.id) {
    return req.user.id;
  }
  // Use the built-in ipKeyGenerator for IPv6 compatibility
  return ipKeyGenerator(req as any);
};

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const orderRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: keyByUserOrIp,
  standardHeaders: true,
  legacyHeaders: false,
});
