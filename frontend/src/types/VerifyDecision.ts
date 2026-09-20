import type { BarrierVerifyStatus } from "../constants/BarrierVerifyStatus";

export type VerifyDecision = Extract<BarrierVerifyStatus, "APPROVED" | "REJECTED">;
