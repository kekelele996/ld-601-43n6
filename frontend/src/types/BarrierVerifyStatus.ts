export const BarrierVerifyStatus = ["PENDING", "APPROVED", "REJECTED"] as const;
export type BarrierVerifyStatus = (typeof BarrierVerifyStatus)[number];
export const BarrierVerifyStatusText: Record<BarrierVerifyStatus, string> = {
  PENDING: "待核实",
  APPROVED: "核实通过",
  REJECTED: "已驳回"
};
