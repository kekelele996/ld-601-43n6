import { useCallback } from "react";
import { useBarrierReportStore } from "../stores/BarrierReportStore";
import { useAccessibleFacilityStore } from "../stores/AccessibleFacilityStore";
import { useRoutePlanStore } from "../stores/RoutePlanStore";
import type { VerifyDecision } from "../types/VerifyDecision";
import { LOG_TEMPLATES } from "../constants/logTemplates";

// 障碍工单核实闭环：调用服务端核实接口，成功后从接口刷新工单、设施、路线三组数据，
// 不做任何本地假数据回退。任一刷新失败都会继续抛出由页面直接提示。
export function useBarrierVerifyFlow() {
  const verifyReport = useBarrierReportStore((state) => state.verify);
  const loadReports = useBarrierReportStore((state) => state.load);
  const loadFacilities = useAccessibleFacilityStore((state) => state.load);
  const loadRoutes = useRoutePlanStore((state) => state.load);
  const processingId = useBarrierReportStore((state) => state.processingId);

  const refreshRelated = useCallback(async () => {
    // 全部以接口最新结果为准，保证设施巡检与路线规划同步展示
    await Promise.all([loadReports(), loadFacilities(), loadRoutes()]);
  }, [loadReports, loadFacilities, loadRoutes]);

  const verify = useCallback(
    async (id: number, decision: VerifyDecision) => {
      console.info(
        decision === "APPROVED" ? LOG_TEMPLATES.BarrierReport[4] : LOG_TEMPLATES.BarrierReport[5],
        id
      );
      const result = await verifyReport(id, decision);
      await refreshRelated();
      return result;
    },
    [verifyReport, refreshRelated]
  );

  return { verify, processingId, refreshRelated };
}
