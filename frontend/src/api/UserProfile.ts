import { request } from "./request";
import type { UserProfile } from "../types/UserProfile";

const endpoint = "/api/user-profile";

export function listUserProfile(): Promise<UserProfile[]> {
  return request<UserProfile[]>(endpoint);
}

export async function saveUserProfile(payload: UserProfile) {
  console.info("save UserProfile", payload);
  return payload;
}
