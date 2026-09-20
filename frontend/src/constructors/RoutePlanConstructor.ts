import type { RoutePlan } from "../types/RoutePlan";

export const createDefaultRoutePlan = (overrides: Partial<RoutePlan> = {}): RoutePlan => ({
  id: 1,
  user_id: 1,
  origin_text: "origin text 1",
  destination_text: "destination text 1",
  route_mode: "route mode 1",
  risk_level: "LOW",
  estimated_minutes: 18,
  facility_ids: [1, 2],
  created_at: "2026-06-11T09:00:00Z",
  ...overrides
});

export const createRoutePlanForm = createDefaultRoutePlan;
export const createRoutePlanResponse = createDefaultRoutePlan;
