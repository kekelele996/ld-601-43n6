import { useEffect } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { RouteRiskPanel } from "../components/common/RouteRiskPanel";
import { useRoutePlanStore } from "../stores/RoutePlanStore";
import { useAccessibleFacilityStore } from "../stores/AccessibleFacilityStore";
import { useAssistanceRequestStore } from "../stores/AssistanceRequestStore";
import { useBarrierReportStore } from "../stores/BarrierReportStore";

export function DashboardPage() {
  const routeState = useRoutePlanStore();
  const facilityState = useAccessibleFacilityStore();
  const assistanceState = useAssistanceRequestStore();
  const reportState = useBarrierReportStore();

  useEffect(() => {
    void Promise.all([routeState.load(), facilityState.load(), assistanceState.load(), reportState.load()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highRiskRoutes = routeState.rows.filter((route) => route.risk_level === "HIGH");
  const blockedFacilities = facilityState.rows.filter((facility) => facility.status === "BLOCKED");
  const pendingReports = reportState.rows.filter((report) => report.verify_status === "PENDING");

  return (
    <main className="page">
      <PageHeader title="通行总览" description="今日协助请求、风险路线、待核实工单与阻断设施一览。" />
      <section className="metrics">
        <StatCard label="待核实障碍工单" value={pendingReports.length} />
        <StatCard label="阻断设施" value={blockedFacilities.length} />
        <StatCard label="高风险路线" value={highRiskRoutes.length} />
      </section>
      <section className="workbench">
        <div className="panel wide">
          <h2>风险路线</h2>
          <div className="table">
            {highRiskRoutes.length === 0 ? <p className="report-meta">当前无高风险路线。</p> : highRiskRoutes.map((route) => (
              <RouteRiskPanel key={route.id} route={route} title={`路线 #${route.id}`} />
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>协助请求</h2>
          <div className="table">
            {assistanceState.rows.map((request) => (
              <article key={request.id} className="row">
                <strong>请求 #{request.id}</strong>
                <span className="report-meta">路线 #{request.route_plan_id}</span>
                <StatusBadge value={request.status} />
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
