import { useCallback, useEffect, useMemo } from "react";
import { message } from "antd";
import { useAssistanceRequestStore } from "../stores/AssistanceRequestStore";
import { useRoutePlanStore } from "../stores/RoutePlanStore";
import { useAccessibleFacilityStore } from "../stores/AccessibleFacilityStore";
import { useBarrierReportStore } from "../stores/BarrierReportStore";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { RouteRiskPanel } from "../components/common/RouteRiskPanel";
import { EmptyState } from "../components/common/EmptyState";
import { BarrierVerifyStatus } from "../constants/BarrierVerifyStatus";
import { formatVerifyStatus } from "../utils/formatters";

export function DashboardPage() {
  const assistance = useAssistanceRequestStore((state) => state.rows);
  const loadAssistance = useAssistanceRequestStore((state) => state.load);
  const routes = useRoutePlanStore((state) => state.rows);
  const loadRoutes = useRoutePlanStore((state) => state.load);
  const facilities = useAccessibleFacilityStore((state) => state.rows);
  const loadFacilities = useAccessibleFacilityStore((state) => state.load);
  const reports = useBarrierReportStore((state) => state.rows);
  const loadReports = useBarrierReportStore((state) => state.load);
  const [messageApi, contextHolder] = message.useMessage();

  const bootstrap = useCallback(async () => {
    try {
      await Promise.all([loadAssistance(), loadRoutes(), loadFacilities(), loadReports()]);
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "加载总览失败");
    }
  }, [loadAssistance, loadRoutes, loadFacilities, loadReports, messageApi]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const todayRequests = assistance.filter((item) => item.status !== "CANCELLED").length;
  const highRiskRoutes = useMemo(() => routes.filter((route) => route.risk_level === "HIGH"), [routes]);
  const abnormalFacilities = facilities.filter((item) => item.status === "BLOCKED" || item.status === "MAINTENANCE");
  const pendingReports = reports.filter((item) => item.verify_status === BarrierVerifyStatus[0]);

  return (
    <main className="page">
      {contextHolder}
      <section className="page-head">
        <div>
          <p className="eyebrow">accessroute</p>
          <h1>通行总览</h1>
        </div>
        <StatusBadge value="SERVER_DATA" label="服务端数据" />
      </section>

      <section className="metrics">
        <StatCard label="进行中协助请求" value={todayRequests} />
        <StatCard label="高风险路线" value={highRiskRoutes.length} />
        <StatCard label="设施异常（停用/维护）" value={abnormalFacilities.length} />
      </section>

      <section className="workbench">
        <div className="panel wide">
          <h2>风险路线</h2>
          {highRiskRoutes.length === 0 ? (
            <EmptyState title="暂无高风险路线" />
          ) : (
            <div className="table">
              {highRiskRoutes.map((route) => (
                <article key={route.id} className="row">
                  <strong>
                    {route.origin_text} → {route.destination_text}
                  </strong>
                  <span>{route.estimated_minutes} 分钟</span>
                  <RouteRiskPanel value={route.risk_level} />
                </article>
              ))}
            </div>
          )}
        </div>
        <div className="panel">
          <h2>待核实障碍工单</h2>
          {pendingReports.length === 0 ? (
            <EmptyState title="暂无待核实工单" />
          ) : (
            pendingReports.map((report) => (
              <article key={report.id} className="row">
                <strong>#{report.id} {report.barrier_type}</strong>
                <StatusBadge value={report.verify_status} label={formatVerifyStatus(report.verify_status)} />
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
