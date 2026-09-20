import type { Request, Response, NextFunction } from "express";
import { barrierReportService } from "../services/BarrierReportService";
import { createBarrierVerifyRequestDto } from "../constructors/BarrierReportDtoFactory";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { BusinessError } from "../utils/errors";
import type { BarrierVerifyAction } from "../types/BarrierReportPayload";

const VALID_ACTIONS: BarrierVerifyAction[] = ["approve", "reject"];

export const barrierReportController = {
  list: (_req: Request, res: Response) => res.json(barrierReportService.list()),

  create: (req: Request, res: Response) => res.status(201).json(barrierReportService.create(req.body)),

  verify: (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        throw new BusinessError(400, ERROR_CODES.VALIDATION_FAILED, `${ERROR_MESSAGES.VALIDATION_FAILED}: report id must be an integer`);
      }
      const rawAction = (req.body as { action?: unknown })?.action;
      if (!VALID_ACTIONS.includes(rawAction as BarrierVerifyAction)) {
        throw new BusinessError(400, ERROR_CODES.VALIDATION_FAILED, `${ERROR_MESSAGES.VALIDATION_FAILED}: action must be approve or reject`);
      }
      const dto = createBarrierVerifyRequestDto({ action: rawAction as BarrierVerifyAction, reason: (req.body as { reason?: unknown })?.reason as string });
      const result = barrierReportService.verify(id, dto);
      res.status(200).json(result);
    } catch (error) {
      // Controller layer wraps transport concerns; service BusinessError keeps its own status/code.
      if (error instanceof BusinessError) {
        next(error);
        return;
      }
      next(new BusinessError(500, "INTERNAL_ERROR", (error as Error).message));
    }
  }
};
