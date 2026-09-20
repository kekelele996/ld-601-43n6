export const VerifyStatus = ["PENDING", "APPROVED", "REJECTED"] as const;
export type VerifyStatus = (typeof VerifyStatus)[number];
export const VerifyStatusLabel: Record<VerifyStatus, string> = {
  PENDING: "待核实",
  APPROVED: "已通过",
  REJECTED: "已驳回"
};
