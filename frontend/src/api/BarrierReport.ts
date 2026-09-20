import { request } from "./request";
import type { BarrierReport } from "../types/BarrierReport";
import type { AccessibleFacility } from "../types/AccessibleFacility";
import type { RoutePlan } from "../types/RoutePlan";

const endpoint = "/api/barrier-report";

export interface BarrierVerifyResult {
  report: BarrierReport;
  facility?: AccessibleFacility;
  affectedRoutes?: RoutePlan[];
}

export function listBarrierReport(): Promise<BarrierReport[]> {
  return request<BarrierReport[]>(endpoint);
}

export function verifyBarrierReport(id: number, action: "approve" | "reject", reason = ""): Promise<BarrierVerifyResult> {
  return request<BarrierVerifyResult>(`${endpoint}/${id}/verify`, {
    method: "POST",
    body: JSON.stringify({ action, reason })
  });
}

export async function saveBarrierReport(payload: BarrierReport) {
  console.info("save BarrierReport", payload);
  return payload;
}
