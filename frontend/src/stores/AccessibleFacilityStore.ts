import { create } from "zustand";
import { listAccessibleFacility } from "../api/AccessibleFacility";
import type { AccessibleFacility } from "../types/AccessibleFacility";

type State = {
  rows: AccessibleFacility[];
  loading: boolean;
  lastError: string | null;
  load: () => Promise<void>;
};

export const useAccessibleFacilityStore = create<State>((set) => ({
  rows: [],
  loading: false,
  lastError: null,
  async load() {
    set({ loading: true, lastError: null });
    try {
      const rows = await listAccessibleFacility();
      set({ rows, loading: false });
    } catch (error) {
      set({ loading: false, lastError: error instanceof Error ? error.message : "加载失败" });
      throw error;
    }
  }
}));
