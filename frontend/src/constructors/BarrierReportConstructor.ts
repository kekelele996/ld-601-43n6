import type { BarrierReport } from "../types/BarrierReport";

export const createDefaultBarrierReport = (overrides: Partial<BarrierReport> = {}): BarrierReport => ({
  id: 1,
  reporter_id: 1,
  facility_id: 1,
  barrier_type: "LOW_VISION",
  description: "description 1",
  photo_url: "/mock/photo_url-1.png",
  verify_status: "PENDING",
  priority: "HIGH",
  ...overrides
});

export const createBarrierReportForm = createDefaultBarrierReport;
export const createBarrierReportResponse = createDefaultBarrierReport;

export const createBarrierVerifyRequest = (overrides: { action?: "approve" | "reject"; reason?: string } = {}): { action: "approve" | "reject"; reason: string } => ({
  action: "approve",
  reason: "",
  ...overrides
});
