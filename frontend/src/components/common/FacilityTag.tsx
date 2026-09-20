import { FacilityStatusLabel } from "../../constants/FacilityStatus";
import { StatusBadge } from "./StatusBadge";
import type { AccessibleFacility } from "../../types/AccessibleFacility";

export function FacilityTag({ facility }: { facility: AccessibleFacility }) {
  return (
    <span className="facility-tag" title={`${facility.location_code} · ${facility.floor}`}>
      <strong>{facility.name}</strong>
      <StatusBadge value={facility.status} label={FacilityStatusLabel[facility.status] ?? facility.status} />
    </span>
  );
}
