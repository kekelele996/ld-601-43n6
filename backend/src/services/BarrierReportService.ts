import { barrierReportRepository } from "../repositories/BarrierReportRepository";
import { accessibleFacilityService } from "./AccessibleFacilityService";
import { routePlanService } from "./RoutePlanService";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { BusinessError } from "../utils/errors";
import type { BarrierVerifyPayload, BarrierVerifyAction } from "../types/BarrierReportPayload";
import type { BarrierReport } from "../models/BarrierReport";
import type { AccessibleFacility } from "../models/AccessibleFacility";
import type { RoutePlan } from "../models/RoutePlan";

export interface BarrierVerifyResult {
  report: BarrierReport;
  facility?: AccessibleFacility;
  affectedRoutes?: RoutePlan[];
}

const PENDING = "PENDING" as const;
const APPROVED = "APPROVED" as const;
const REJECTED = "REJECTED" as const;
const HIGH = "HIGH" as const;

const writeAudit = (template: string, target: string, extra?: Record<string, unknown>) =>
  console.info("audit", template, target, extra ?? {});

export const barrierReportService = {
  list: (): BarrierReport[] => barrierReportRepository.findAll(),

  create: (row: unknown) => barrierReportRepository.save(row),

  verify: (id: number, payload: BarrierVerifyPayload): BarrierVerifyResult => {
    const action: BarrierVerifyAction = payload.action;
    const report = barrierReportRepository.findById(id);
    if (!report) {
      throw new BusinessError(404, ERROR_CODES.BARRIER_REPORT_NOT_FOUND, `${ERROR_MESSAGES.BARRIER_REPORT_NOT_FOUND}: #${id}`);
    }
    if (report.verify_status !== PENDING) {
      throw new BusinessError(409, ERROR_CODES.BARRIER_REPORT_ALREADY_VERIFIED, `${ERROR_MESSAGES.BARRIER_REPORT_ALREADY_VERIFIED}: #${id} is ${report.verify_status}`);
    }

    if (action === "reject") {
      const updated = barrierReportRepository.updateVerifyStatus(id, REJECTED);
      writeAudit(LOG_TEMPLATES.BarrierReport[5], `BarrierReport#${id}`, { verify_status: REJECTED, reason: payload.reason ?? "" });
      return { report: updated as BarrierReport };
    }

    // approve: same request blocks the linked facility and raises every route referencing it
    const facility = accessibleFacilityService.markBlocked(report.facility_id);
    const affectedRoutes = routePlanService.raiseRiskForFacility(report.facility_id, HIGH);
    const updated = barrierReportRepository.updateVerifyStatus(id, APPROVED);
    writeAudit(LOG_TEMPLATES.BarrierReport[4], `BarrierReport#${id}`, {
      verify_status: APPROVED,
      facility_id: facility.id,
      affected_route_ids: affectedRoutes.map((route) => route.id)
    });
    return { report: updated as BarrierReport, facility, affectedRoutes };
  }
};
