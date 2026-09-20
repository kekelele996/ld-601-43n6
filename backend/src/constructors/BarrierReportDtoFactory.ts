import type { VerifyStatus } from "../constants/VerifyStatus";
import type { BarrierVerifyAction } from "../types/BarrierReportPayload";

export const createBarrierReportDto = (overrides = {}): { id: number; reporter_id: number; facility_id: number; barrier_type: string; description: string; photo_url: string; verify_status: VerifyStatus; priority: string } => ({ id: 1, reporter_id: 1, facility_id: 1, barrier_type: "LOW_VISION", description: "description 1", photo_url: "/mock/photo_url-1.png", verify_status: "PENDING", priority: "HIGH", ...overrides });

export const createBarrierVerifyRequestDto = (overrides = {} as Partial<{ action: BarrierVerifyAction; reason: string }>): { action: BarrierVerifyAction; reason: string } => ({ action: "approve", reason: "", ...overrides });
