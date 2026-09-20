import { seed } from "../seed";
import type { AccessibleFacility } from "../models/AccessibleFacility";

const rows: AccessibleFacility[] = seed.accessibleFacility.map((row) => ({ ...row }));

export const accessibleFacilityRepository = {
  findAll: (): AccessibleFacility[] => rows,
  findById: (id: number): AccessibleFacility | undefined => rows.find((row) => row.id === id),
  save: (row: AccessibleFacility): AccessibleFacility => row,
  updateStatus: (id: number, status: string, last_checked_at: string): AccessibleFacility => {
    const row = rows.find((item) => item.id === id);
    if (!row) {
      throw new Error(`accessible facility ${id} not found`);
    }
    row.status = status;
    row.last_checked_at = last_checked_at;
    return row;
  }
};
