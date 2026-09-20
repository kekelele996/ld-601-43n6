import { request } from "./request";
import type { AccessibleFacility } from "../types/AccessibleFacility";

const endpoint = "/api/accessible-facility";

export async function listAccessibleFacility(): Promise<AccessibleFacility[]> {
  return request<AccessibleFacility[]>(endpoint);
}

export async function saveAccessibleFacility(payload: AccessibleFacility) {
  console.info("save AccessibleFacility", payload);
  return payload;
}
