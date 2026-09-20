import { create } from "zustand";
import { listAccessibleFacility } from "../api/AccessibleFacility";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { AccessibleFacility } from "../types/AccessibleFacility";

type State = { rows: AccessibleFacility[]; loading: boolean; error: string | null; load: () => Promise<void> };

const resolveErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code;
  if (code && code in ERROR_MESSAGES) return ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
  return (error as Error)?.message ?? ERROR_MESSAGES.NETWORK_ERROR;
};

export const useAccessibleFacilityStore = create<State>((set) => ({
  rows: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true, error: null });
    try {
      const rows = await listAccessibleFacility();
      set({ rows, loading: false });
    } catch (error) {
      set({ loading: false, error: resolveErrorMessage(error) });
    }
  }
}));
