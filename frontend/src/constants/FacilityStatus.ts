export const FacilityStatus = ["AVAILABLE","BLOCKED","MAINTENANCE","UNKNOWN"] as const;
export type FacilityStatus = (typeof FacilityStatus)[number];
export const FacilityStatusText: Record<FacilityStatus, string> = Object.fromEntries(FacilityStatus.map((value) => [value, value.replace(/_/g, " ")])) as Record<FacilityStatus, string>;
export const FacilityStatusLabel: Record<FacilityStatus, string> = {
  AVAILABLE: "可用",
  BLOCKED: "阻断",
  MAINTENANCE: "维护中",
  UNKNOWN: "未知"
};
