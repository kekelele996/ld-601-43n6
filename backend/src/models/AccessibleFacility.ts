import type { FacilityStatus } from "../constants/FacilityStatus";

export interface AccessibleFacility {
  id: number;
  facility_type: string;
  name: string;
  location_code: string;
  floor: string;
  status: FacilityStatus | string;
  last_checked_at: string;
  owner_department: string;
  note: string;
}
