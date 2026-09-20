import type { RequestHandler } from "express";
import { HttpError } from "../utils/HttpError";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const rbacMiddleware = (roles: string[] = []): RequestHandler => (req, _res, next) => {
  if (roles.length === 0) {
    next();
    return;
  }
  const role = (req as unknown as { user?: { role?: string } }).user?.role;
  if (role && roles.includes(role)) {
    next();
    return;
  }
  next(new HttpError(403, ERROR_CODES.RBAC_DENIED, ERROR_MESSAGES.RBAC_DENIED));
};
