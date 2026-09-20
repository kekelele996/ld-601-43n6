import { request } from "./request";
import type { BarrierReport } from "../types/BarrierReport";
import type { BarrierVerifyResult } from "../types/BarrierVerifyResult";
import type { VerifyDecision } from "../types/VerifyDecision";

const endpoint = "/api/barrier-report";

export async function listBarrierReport(): Promise<BarrierReport[]> {
  return request<BarrierReport[]>(endpoint);
}

export async function saveBarrierReport(payload: BarrierReport) {
  console.info("save BarrierReport", payload);
  return payload;
}

// 核实闭环：同一次请求由服务端完成工单结论 + 设施停用 + 路线风险升高
export async function verifyBarrierReport(id: number, decision: VerifyDecision): Promise<BarrierVerifyResult> {
  return request<BarrierVerifyResult>(`${endpoint}/${id}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ decision })
  });
}
