export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  NETWORK_ERROR: "服务连接失败，请稍后重试",
  BARRIER_REPORT_NOT_FOUND: "障碍工单不存在或已被删除",
  BARRIER_ALREADY_VERIFIED: "工单已处理，请勿重复核实",
  VERIFY_DECISION_INVALID: "核实动作仅支持 APPROVED 或 REJECTED",
  REFERENCE_FACILITY_NOT_FOUND: "工单关联的无障碍设施不存在",
  INTERNAL_ERROR: "服务暂时不可用，请稍后再试"
} as const;
