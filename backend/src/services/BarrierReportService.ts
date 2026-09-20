import { barrierReportRepository } from "../repositories/BarrierReportRepository";
import { accessibleFacilityRepository } from "../repositories/AccessibleFacilityRepository";
import { routePlanRepository } from "../repositories/RoutePlanRepository";
import type { BarrierVerifyDecision } from "../types/BarrierReportPayload";
import type { BarrierReport } from "../models/BarrierReport";
import type { AccessibleFacility } from "../models/AccessibleFacility";
import type { RoutePlan } from "../models/RoutePlan";
import { FacilityStatus } from "../constants/FacilityStatus";
import { RouteRiskLevel } from "../constants/RouteRiskLevel";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { HttpError } from "../utils/HttpError";
import { createBarrierVerifyResultDto } from "../constructors/BarrierReportDtoFactory";

export type BarrierVerifyResultDto = ReturnType<typeof createBarrierVerifyResultDto>;

// 与 BarrierVerifyStatus 枚举（PENDING/APPROVED/REJECTED）保持一致的判定字面量
const PENDING = "PENDING";
const APPROVED_DECISION: BarrierVerifyDecision = "APPROVED";
const REJECTED_DECISION: BarrierVerifyDecision = "REJECTED";
const BLOCKED_STATUS = FacilityStatus[1];
const HIGH_RISK = RouteRiskLevel[2];

const toServiceError = (error: unknown): HttpError => {
  if (error instanceof HttpError) {
    return error;
  }
  return new HttpError(500, ERROR_CODES.INTERNAL_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
};

const writeAuditLog = (action: string, reportId: number, decision: string, actor?: number) => {
  console.info("audit", { action, target: `BarrierReport#${reportId}`, decision, actor: actor ?? 0 });
};

export const barrierReportService = {
  list: () => barrierReportRepository.findAll(),

  create: (row: unknown) => barrierReportRepository.save(row as BarrierReport),

  verify: (id: number, decision: string, actorId?: number): BarrierVerifyResultDto => {
    try {
      if (decision !== APPROVED_DECISION && decision !== REJECTED_DECISION) {
        throw new HttpError(400, ERROR_CODES.VERIFY_DECISION_INVALID, ERROR_MESSAGES.VERIFY_DECISION_INVALID);
      }

      const report = barrierReportRepository.findById(id);
      if (!report) {
        throw new HttpError(404, ERROR_CODES.BARRIER_REPORT_NOT_FOUND, ERROR_MESSAGES.BARRIER_REPORT_NOT_FOUND);
      }
      if (report.verify_status !== PENDING) {
        // 重复处理（二次通过/驳回或状态已变更）直接冲突，禁止覆盖既有结论
        throw new HttpError(409, ERROR_CODES.BARRIER_ALREADY_VERIFIED, ERROR_MESSAGES.BARRIER_ALREADY_VERIFIED);
      }

      const decisionType = decision as BarrierVerifyDecision;
      let facility: AccessibleFacility | null = null;
      let affectedRoutes: RoutePlan[] = [];

      if (decisionType === APPROVED_DECISION) {
        const linkedFacility = accessibleFacilityRepository.findById(report.facility_id);
        if (!linkedFacility) {
          throw new HttpError(422, ERROR_CODES.REFERENCE_FACILITY_NOT_FOUND, ERROR_MESSAGES.REFERENCE_FACILITY_NOT_FOUND);
        }
        facility = accessibleFacilityRepository.updateStatus(
          linkedFacility.id,
          BLOCKED_STATUS, // 核实通过即在同一请求内停用关联设施
          new Date().toISOString()
        );
        const relatedRoutes = routePlanRepository.findByFacilityId(linkedFacility.id);
        affectedRoutes = routePlanRepository.updateRiskLevel(
          relatedRoutes.map((route) => route.id),
          HIGH_RISK // 所有引用该设施的路线风险同步升高
        );
      }

      const updatedReport = barrierReportRepository.updateVerifyStatus(report.id, decisionType);
      writeAuditLog(
        decisionType === APPROVED_DECISION ? LOG_TEMPLATES.BarrierReport[4] : LOG_TEMPLATES.BarrierReport[5],
        report.id,
        decisionType,
        actorId
      );

      return createBarrierVerifyResultDto({
        report: updatedReport,
        facility,
        affectedRoutes,
        affectedRouteCount: affectedRoutes.length
      });
    } catch (error) {
      throw toServiceError(error);
    }
  }
};
