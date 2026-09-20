import { request } from "./request";
import type { AssistanceRequest } from "../types/AssistanceRequest";

const endpoint = "/api/assistance-request";

export function listAssistanceRequest(): Promise<AssistanceRequest[]> {
  return request<AssistanceRequest[]>(endpoint);
}

export async function saveAssistanceRequest(payload: AssistanceRequest) {
  console.info("save AssistanceRequest", payload);
  return payload;
}
