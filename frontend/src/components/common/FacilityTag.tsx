import { StatusBadge } from "./StatusBadge";
import type { AccessibleFacility } from "../../types/AccessibleFacility";

interface FacilityTagProps {
  facility?: AccessibleFacility | null;
  title?: string;
  // 兼容旧用法：直接传入状态值
  value?: string;
}

export function FacilityTag({ facility, title, value = "READY" }: FacilityTagProps) {
  if (!facility) {
    return (
      <div className="shared-widget facility-tag">
        <strong>{title ?? "关联设施"}</strong>
        <StatusBadge value="UNKNOWN" label="设施缺失" />
      </div>
    );
  }
  return (
    <div className="shared-widget facility-tag">
      <strong>{title ?? facility.name}</strong>
      <span className="tag-meta">{facility.location_code} · {facility.floor}</span>
      <StatusBadge value={facility.status} />
    </div>
  );
}
