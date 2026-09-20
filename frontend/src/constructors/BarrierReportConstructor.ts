import type { BarrierReport } from "../types/BarrierReport";

export const createDefaultBarrierReport = (overrides: Partial<BarrierReport> = {}): BarrierReport => ({
  id: 1 as never,
  reporter_id: 1 as never,
  facility_id: 1 as never,
  barrier_type: "坡道堵塞" as never,
  description: "description 1" as never,
  photo_url: "/mock/photo_url-1.png" as never,
  verify_status: "PENDING" as never,
  priority: "HIGH" as never,
  ...overrides
});

export const createBarrierReportForm = createDefaultBarrierReport;
export const createBarrierReportResponse = createDefaultBarrierReport;
