import { create } from "zustand";
import { listBarrierReport, verifyBarrierReport, type BarrierVerifyResult } from "../api/BarrierReport";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { BarrierReport } from "../types/BarrierReport";
import { useAccessibleFacilityStore } from "./AccessibleFacilityStore";
import { useRoutePlanStore } from "./RoutePlanStore";

type VerifyAction = "approve" | "reject";

type State = {
  rows: BarrierReport[];
  loading: boolean;
  error: string | null;
  processingId: number | null;
  actionError: string | null;
  lastResult: BarrierVerifyResult | null;
  load: () => Promise<void>;
  verify: (id: number, action: VerifyAction, reason?: string) => Promise<boolean>;
  clearActionError: () => void;
};

const resolveErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code;
  if (code && code in ERROR_MESSAGES) return ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
  return (error as Error)?.message ?? ERROR_MESSAGES.NETWORK_ERROR;
};

export const useBarrierReportStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  error: null,
  processingId: null,
  actionError: null,
  lastResult: null,

  async load() {
    set({ loading: true, error: null });
    try {
      const rows = await listBarrierReport();
      set({ rows, loading: false });
    } catch (error) {
      // Server failure is surfaced directly; never fall back to local fake rows.
      set({ loading: false, error: resolveErrorMessage(error) });
    }
  },

  async verify(id, action, reason = "") {
    if (get().processingId !== null) return false;
    set({ processingId: id, actionError: null });
    try {
      const result = await verifyBarrierReport(id, action, reason);
      console.info(LOG_TEMPLATES.BarrierReport[action === "approve" ? 4 : 5], id, result);
      set({ processingId: null, lastResult: result });
      // Refresh every affected entity from the API in the same closed loop.
      await Promise.all([
        get().load(),
        useAccessibleFacilityStore.getState().load(),
        useRoutePlanStore.getState().load()
      ]);
      return true;
    } catch (error) {
      // No optimistic local mutation happened, so there is nothing to roll back.
      set({ processingId: null, actionError: resolveErrorMessage(error) });
      return false;
    }
  },

  clearActionError() {
    set({ actionError: null });
  }
}));
