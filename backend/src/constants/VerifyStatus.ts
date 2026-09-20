export const VerifyStatus = ["PENDING", "APPROVED", "REJECTED"] as const;
export type VerifyStatus = (typeof VerifyStatus)[number];
