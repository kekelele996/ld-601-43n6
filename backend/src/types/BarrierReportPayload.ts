import type { BarrierVerifyStatus } from "../constants/BarrierVerifyStatus";

export type BarrierVerifyDecision = Extract<BarrierVerifyStatus, "APPROVED" | "REJECTED">;

export interface BarrierReportVerifyPayload {
  decision: BarrierVerifyDecision;
}

export type BarrierReportPayload = Record<string, unknown> | BarrierReportVerifyPayload;
