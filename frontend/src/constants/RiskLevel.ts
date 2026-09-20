export const RiskLevel = ["LOW", "MEDIUM", "HIGH"] as const;
export type RiskLevel = (typeof RiskLevel)[number];
export const RiskLevelLabel: Record<RiskLevel, string> = {
  LOW: "低",
  MEDIUM: "中",
  HIGH: "高"
};
