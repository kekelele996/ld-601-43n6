import { create } from "zustand";
import { listRoutePlan } from "../api/RoutePlan";
import type { RoutePlan } from "../types/RoutePlan";

type State = {
  rows: RoutePlan[];
  loading: boolean;
  lastError: string | null;
  load: () => Promise<void>;
};

export const useRoutePlanStore = create<State>((set) => ({
  rows: [],
  loading: false,
  lastError: null,
  async load() {
    set({ loading: true, lastError: null });
    try {
      const rows = await listRoutePlan();
      set({ rows, loading: false });
    } catch (error) {
      set({ loading: false, lastError: error instanceof Error ? error.message : "加载失败" });
      throw error;
    }
  }
}));
