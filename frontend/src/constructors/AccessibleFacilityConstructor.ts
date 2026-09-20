import type { AccessibleFacility } from "../types/AccessibleFacility";

export const createDefaultAccessibleFacility = (overrides: Partial<AccessibleFacility> = {}): AccessibleFacility => ({
  id: 1,
  facility_type: "LOW_VISION",
  name: "name 1",
  location_code: "location code 1",
  floor: "floor 1",
  status: "AVAILABLE",
  last_checked_at: "2026-06-11T09:00:00Z",
  owner_department: "owner department 1",
  note: "note 1",
  ...overrides
});

export const createAccessibleFacilityForm = createDefaultAccessibleFacility;
export const createAccessibleFacilityResponse = createDefaultAccessibleFacility;
