import { useEffect, useMemo } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { RouteRiskPanel } from "../components/common/RouteRiskPanel";
import { EmptyState } from "../components/common/EmptyState";
import { useRoutePlanStore } from "../stores/RoutePlanStore";
import { useAccessibleFacilityStore } from "../stores/AccessibleFacilityStore";
import { FacilityTag } from "../components/common/FacilityTag";
import { formatDate } from "../utils/formatters";

export function RoutesPage() {
  const { rows, loading, error, load } = useRoutePlanStore();
  const facilityState = useAccessibleFacilityStore();

  useEffect(() => {
    void Promise.all([load(), facilityState.load()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facilityMap = useMemo(() => new Map(facilityState.rows.map((facility) => [facility.id, facility])), [facilityState.rows]);

  return (
    <main className="page">
      <PageHeader
        title="路线规划"
        description="引用阻断设施的路线会在工单核实通过的同一次请求中被置为高风险，操作后从接口刷新展示最新结果。"
        extra={<button type="button" className="btn" onClick={() => void Promise.all([load(), facilityState.load()])} disabled={loading}>刷新</button>}
      />

      {error ? (
        <div className="alert alert-error" role="alert">
          <span>{error}</span>
          <button type="button" className="btn" onClick={() => void load()}>重试</button>
        </div>
      ) : null}
      {loading ? <div className="loading">加载中…</div> : null}
      {!loading && !error && rows.length === 0 ? <EmptyState title="暂无路线规划" /> : null}

      {!loading && !error ? (
        <section className="workbench workbench-stack">
          {rows.map((route) => (
            <RouteRiskPanel
              key={route.id}
              route={route}
              title={`路线 #${route.id} · 风险${route.risk_level === "HIGH" ? "（已受阻断设施影响）" : ""}`}
              extra={
                <div className="route-detail">
                  <p className="report-meta">{route.origin_text} → {route.destination_text} · 预计 {route.estimated_minutes} 分钟 · 创建于 {formatDate(route.created_at)}</p>
                  <div className="route-facilities">
                    {route.facility_ids.map((facilityId) => {
                      const facility = facilityMap.get(facilityId);
                      return facility ? <FacilityTag key={facilityId} facility={facility} /> : <span key={facilityId} className="link-missing">设施 #{facilityId}</span>;
                    })}
                  </div>
                </div>
              }
            />
          ))}
        </section>
      ) : null}
    </main>
  );
}
