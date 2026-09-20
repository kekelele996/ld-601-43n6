import { create } from "zustand";
import { listUserProfile } from "../api/UserProfile";
import type { UserProfile } from "../types/UserProfile";

type State = {
  rows: UserProfile[];
  loading: boolean;
  lastError: string | null;
  load: () => Promise<void>;
};

export const useUserProfileStore = create<State>((set) => ({
  rows: [],
  loading: false,
  lastError: null,
  async load() {
    set({ loading: true, lastError: null });
    try {
      const rows = await listUserProfile();
      set({ rows, loading: false });
    } catch (error) {
      set({ loading: false, lastError: error instanceof Error ? error.message : "加载失败" });
      throw error;
    }
  }
}));
