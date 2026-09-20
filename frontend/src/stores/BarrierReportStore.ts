import { create } from "zustand";
import { listBarrierReport, verifyBarrierReport } from "../api/BarrierReport";
import type { BarrierReport } from "../types/BarrierReport";
import type { BarrierVerifyResult } from "../types/BarrierVerifyResult";
import type { VerifyDecision } from "../types/VerifyDecision";

type State = {
  rows: BarrierReport[];
  loading: boolean;
  processingId: number | null;
  lastError: string | null;
  load: () => Promise<void>;
  verify: (id: number, decision: VerifyDecision) => Promise<BarrierVerifyResult>;
};

export const useBarrierReportStore = create<State>((set) => ({
  rows: [],
  loading: false,
  processingId: null,
  lastError: null,
  async load() {
    set({ loading: true, lastError: null });
    try {
      const rows = await listBarrierReport();
      // 仅当接口成功才覆盖列表，杜绝本地假数据回退
      set({ rows, loading: false });
    } catch (error) {
      set({ loading: false, lastError: error instanceof Error ? error.message : "加载失败" });
      throw error;
    }
  },
  async verify(id, decision) {
    set({ processingId: id, lastError: null });
    try {
      // 不做乐观更新：等待服务端结论，随后由页面重新拉取工单/设施/路线
      const result = await verifyBarrierReport(id, decision);
      set({ processingId: null });
      return result;
    } catch (error) {
      set({
        processingId: null,
        lastError: error instanceof Error ? error.message : "核实失败"
      });
      throw error;
    }
  }
}));
