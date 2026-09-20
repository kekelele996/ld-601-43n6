import { seed } from "../seed";
import type { AccessibleFacility } from "../models/AccessibleFacility";
import type { FacilityStatus } from "../constants/FacilityStatus";

const rows: AccessibleFacility[] = (seed.accessibleFacility as unknown as AccessibleFacility[]).map((row) => ({ ...row }));

export const accessibleFacilityRepository = {
  findAll: (): AccessibleFacility[] => rows,
  findById: (id: number): AccessibleFacility | undefined => rows.find((row) => row.id === id),
  save: (row: unknown): unknown => row,
  updateStatus: (id: number, status: FacilityStatus, last_checked_at: string): AccessibleFacility | undefined => {
    const target = rows.find((row) => row.id === id);
    if (!target) return undefined;
    target.status = status;
    target.last_checked_at = last_checked_at;
    return target;
  }
};
