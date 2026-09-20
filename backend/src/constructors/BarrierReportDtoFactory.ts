import type { BarrierReport } from "../models/BarrierReport";
import type { AccessibleFacility } from "../models/AccessibleFacility";
import type { RoutePlan } from "../models/RoutePlan";

export const createBarrierReportDto = (overrides = {}) => ({
  id: 1,
  reporter_id: 1,
  facility_id: 1,
  barrier_type: "坡道堵塞",
  description: "description 1",
  photo_url: "/mock/photo_url-1.png",
  verify_status: "PENDING",
  priority: "HIGH",
  ...overrides
});

export interface BarrierVerifyResultDtoShape {
  report: BarrierReport;
  facility: AccessibleFacility | null;
  affectedRoutes: RoutePlan[];
  affectedRouteCount: number;
}

// 核实闭环响应：工单结论 + 被同步停用的设施 + 风险被置为 HIGH 的路线
export const createBarrierVerifyResultDto = (
  overrides: Partial<BarrierVerifyResultDtoShape>
): BarrierVerifyResultDtoShape => ({
  report: createBarrierReportDto() as unknown as BarrierReport,
  facility: null,
  affectedRoutes: [],
  affectedRouteCount: 0,
  ...overrides
});
