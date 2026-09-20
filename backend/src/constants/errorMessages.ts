export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  BARRIER_REPORT_NOT_FOUND: "障碍工单不存在或已被删除",
  BARRIER_ALREADY_VERIFIED: "工单已处理，请勿重复核实",
  VERIFY_DECISION_INVALID: "核实动作仅支持 APPROVED 或 REJECTED",
  REFERENCE_FACILITY_NOT_FOUND: "工单关联的无障碍设施不存在",
  INTERNAL_ERROR: "服务暂时不可用，请稍后再试"
} as const;
