export const RouteRiskLevel = ["LOW", "MEDIUM", "HIGH"] as const;
export type RouteRiskLevel = (typeof RouteRiskLevel)[number];
