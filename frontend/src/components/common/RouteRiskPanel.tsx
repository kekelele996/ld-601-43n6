import type { ReactNode } from "react";
import { RiskLevelLabel } from "../../constants/RiskLevel";
import { StatusBadge } from "./StatusBadge";
import type { RoutePlan } from "../../types/RoutePlan";

export function RouteRiskPanel({ title = "路线风险", route, extra }: { title?: string; route?: RoutePlan; extra?: ReactNode }) {
  const value = route?.risk_level ?? "READY";
  const label = route ? RiskLevelLabel[route.risk_level] ?? route.risk_level : undefined;
  return (
    <div className="shared-widget route-risk">
      <strong>{title}</strong>
      {route && <span className="route-risk-text">{route.origin_text} → {route.destination_text}</span>}
      <StatusBadge value={value} label={label} />
      {extra}
    </div>
  );
}
