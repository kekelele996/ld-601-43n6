import { create } from "zustand";
import { listRoutePlan } from "../api/RoutePlan";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { RoutePlan } from "../types/RoutePlan";

type State = { rows: RoutePlan[]; loading: boolean; error: string | null; load: () => Promise<void> };

const resolveErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code;
  if (code && code in ERROR_MESSAGES) return ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
  return (error as Error)?.message ?? ERROR_MESSAGES.NETWORK_ERROR;
};

export const useRoutePlanStore = create<State>((set) => ({
  rows: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true, error: null });
    try {
      const rows = await listRoutePlan();
      set({ rows, loading: false });
    } catch (error) {
      set({ loading: false, error: resolveErrorMessage(error) });
    }
  }
}));
