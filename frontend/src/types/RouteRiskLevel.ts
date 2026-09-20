export const RouteRiskLevel = ["LOW", "MEDIUM", "HIGH"] as const;
export type RouteRiskLevel = (typeof RouteRiskLevel)[number];
export const RouteRiskLevelText: Record<RouteRiskLevel, string> = {
  LOW: "低风险",
  MEDIUM: "中风险",
  HIGH: "高风险"
};
