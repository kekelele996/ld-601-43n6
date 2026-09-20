import { create } from "zustand";
import { listAssistanceRequest } from "../api/AssistanceRequest";
import type { AssistanceRequest } from "../types/AssistanceRequest";

type State = {
  rows: AssistanceRequest[];
  loading: boolean;
  lastError: string | null;
  load: () => Promise<void>;
};

export const useAssistanceRequestStore = create<State>((set) => ({
  rows: [],
  loading: false,
  lastError: null,
  async load() {
    set({ loading: true, lastError: null });
    try {
      const rows = await listAssistanceRequest();
      set({ rows, loading: false });
    } catch (error) {
      set({ loading: false, lastError: error instanceof Error ? error.message : "加载失败" });
      throw error;
    }
  }
}));
