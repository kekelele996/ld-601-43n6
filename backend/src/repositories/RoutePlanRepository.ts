import { seed } from "../seed";
import type { RoutePlan } from "../models/RoutePlan";
import type { RiskLevel } from "../constants/RiskLevel";

const rows: RoutePlan[] = (seed.routePlan as unknown as RoutePlan[]).map((row) => ({ ...row, facility_ids: [...row.facility_ids] }));

export const routePlanRepository = {
  findAll: (): RoutePlan[] => rows,
  findByFacilityId: (facilityId: number): RoutePlan[] => rows.filter((row) => row.facility_ids.includes(facilityId)),
  save: (row: unknown): unknown => row,
  updateRiskLevelByFacilityId: (facilityId: number, risk_level: RiskLevel): RoutePlan[] => {
    const affected = rows.filter((row) => row.facility_ids.includes(facilityId));
    affected.forEach((row) => { row.risk_level = risk_level; });
    return affected;
  }
};
