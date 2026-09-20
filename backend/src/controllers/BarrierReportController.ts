import type { Request, Response, NextFunction } from "express";
import { barrierReportService } from "../services/BarrierReportService";
import { HttpError } from "../utils/HttpError";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";

const toControllerError = (error: unknown): HttpError => {
  if (error instanceof HttpError) {
    return error;
  }
  console.error("controller", LOG_TEMPLATES.BarrierReport[4], error);
  return new HttpError(500, ERROR_CODES.INTERNAL_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
};

export const barrierReportController = {
  list: (_req: Request, res: Response) => res.json(barrierReportService.list()),

  create: (req: Request, res: Response) => res.status(201).json(barrierReportService.create(req.body)),

  verify: (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        throw new HttpError(400, ERROR_CODES.VALIDATION_FAILED, ERROR_MESSAGES.VALIDATION_FAILED);
      }
      const decision = (req.body ?? {}).decision;
      const actorId = (req as unknown as { user?: { id?: number } }).user?.id;
      // 通过：同请求内停用设施并抬高路线风险；驳回：只更新工单；重复处理由服务层抛 409
      const result = barrierReportService.verify(id, decision, actorId);
      res.json(result);
    } catch (error) {
      next(toControllerError(error));
    }
  }
};
