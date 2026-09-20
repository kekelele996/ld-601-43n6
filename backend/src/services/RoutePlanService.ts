import { routePlanRepository } from "../repositories/RoutePlanRepository";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { RoutePlan } from "../models/RoutePlan";
import type { RiskLevel } from "../constants/RiskLevel";

export const routePlanService = {
  list: (): RoutePlan[] => routePlanRepository.findAll(),

  create: (row: unknown) => routePlanRepository.save(row),

  raiseRiskForFacility: (facilityId: number, riskLevel: RiskLevel): RoutePlan[] => {
    const affected = routePlanRepository.updateRiskLevelByFacilityId(facilityId, riskLevel);
    console.info("audit", LOG_TEMPLATES.RoutePlan[2], `AccessibleFacility#${facilityId}`, {
      risk_level: riskLevel,
      affected_route_ids: affected.map((route) => route.id)
    });
    return affected;
  }
};
