import { request } from "./request";
import type { RoutePlan } from "../types/RoutePlan";

const endpoint = "/api/route-plan";

export function listRoutePlan(): Promise<RoutePlan[]> {
  return request<RoutePlan[]>(endpoint);
}

export async function saveRoutePlan(payload: RoutePlan) {
  console.info("save RoutePlan", payload);
  return payload;
}
