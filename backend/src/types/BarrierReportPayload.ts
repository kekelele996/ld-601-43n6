export type BarrierVerifyAction = "approve" | "reject";

export interface BarrierVerifyPayload {
  action: BarrierVerifyAction;
  reason?: string;
}

export type BarrierReportPayload = Record<string, unknown>;
