export const BarrierVerifyStatus = ["PENDING", "APPROVED", "REJECTED"] as const;
export type BarrierVerifyStatus = (typeof BarrierVerifyStatus)[number];
