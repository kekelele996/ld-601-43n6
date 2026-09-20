import { BarrierVerifyStatusText } from "../constants/BarrierVerifyStatus";
import { RouteRiskLevelText } from "../constants/RouteRiskLevel";

export const formatDate = (value: string) => new Date(value).toLocaleString("zh-CN");
export const formatStatus = (value: string) => value.replace(/_/g, " ");
export const formatNumber = (value: number) => new Intl.NumberFormat("zh-CN").format(value);
export const formatRisk = (value: string) =>
  ({ LOW: "低", MEDIUM: "中", HIGH: "高", CRITICAL: "严重", EXTREME: "极高" }[value] ?? value);

// 障碍工单核实状态：优先取中文文案，未知状态回退为原始值
export const formatVerifyStatus = (value: string) =>
  (BarrierVerifyStatusText as Record<string, string>)[value] ?? value;

// 路线风险：与 RouteRiskLevel 枚举保持一致的中文展示
export const formatRouteRisk = (value: string) =>
  (RouteRiskLevelText as Record<string, string>)[value] ?? formatRisk(value);

export const formatPriority = (value: string) =>
  ({ HIGH: "高", MEDIUM: "中", LOW: "低" }[value] ?? value);
