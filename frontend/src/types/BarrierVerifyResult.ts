import type { BarrierReport } from "./BarrierReport";
import type { AccessibleFacility } from "./AccessibleFacility";
import type { RoutePlan } from "./RoutePlan";

// 与后端 createBarrierVerifyResultDto 对齐的核实闭环响应
export interface BarrierVerifyResult {
  report: BarrierReport;
  facility: AccessibleFacility | null;
  affectedRoutes: RoutePlan[];
  affectedRouteCount: number;
}
