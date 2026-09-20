import { StatusBadge } from "./StatusBadge";
import { formatRouteRisk } from "../../utils/formatters";

interface RouteRiskPanelProps {
  value: string;
  title?: string;
  affectedCount?: number;
  detail?: string;
}

// 共享于通行总览与路线规划：展示风险等级及受影响说明
export function RouteRiskPanel({ value, title = "路线风险", affectedCount, detail }: RouteRiskPanelProps) {
  return (
    <div className={"shared-widget route-risk risk-" + String(value).toLowerCase()}>
      <strong>{title}</strong>
      <StatusBadge value={value} label={formatRouteRisk(value)} />
      {typeof affectedCount === "number" && (
        <span className="tag-meta">受影响路线 {affectedCount} 条</span>
      )}
      {detail && <p className="risk-detail">{detail}</p>}
    </div>
  );
}
