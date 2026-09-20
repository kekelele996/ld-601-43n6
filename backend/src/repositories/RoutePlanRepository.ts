import { seed } from "../seed";
import type { RoutePlan } from "../models/RoutePlan";

const rows: RoutePlan[] = seed.routePlan.map((row) => ({ ...row, facility_ids: [...row.facility_ids] }));

export const routePlanRepository = {
  findAll: (): RoutePlan[] => rows,
  findByFacilityId: (facilityId: number): RoutePlan[] =>
    rows.filter((row) => row.facility_ids.includes(facilityId)),
  save: (row: RoutePlan): RoutePlan => row,
  updateRiskLevel: (ids: number[], risk_level: string): RoutePlan[] => {
    const affected: RoutePlan[] = [];
    rows.forEach((row) => {
      if (ids.includes(row.id)) {
        row.risk_level = risk_level;
        affected.push(row);
      }
    });
    return affected;
  }
};
