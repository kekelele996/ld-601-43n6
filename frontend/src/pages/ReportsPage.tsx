import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { FacilityTag } from "../components/common/FacilityTag";
import { EmptyState } from "../components/common/EmptyState";
import { FilterBar } from "../components/common/FilterBar";
import { VerifyStatus, VerifyStatusLabel, type VerifyStatus as VerifyStatusValue } from "../constants/VerifyStatus";
import { useBarrierReportStore } from "../stores/BarrierReportStore";
import { useAccessibleFacilityStore } from "../stores/AccessibleFacilityStore";
import { useRoutePlanStore } from "../stores/RoutePlanStore";
import type { BarrierReport } from "../types/BarrierReport";

type FilterValue = "ALL" | VerifyStatusValue;

export function ReportsPage() {
  const { rows, loading, error, processingId, actionError, lastResult, load, verify, clearActionError } = useBarrierReportStore();
  const facilityState = useAccessibleFacilityStore();
  const routeState = useRoutePlanStore();
  const [filter, setFilter] = useState<FilterValue>("PENDING");

  useEffect(() => {
    void Promise.all([load(), facilityState.load(), routeState.load()]);
    // load identities are stable zustand actions; refresh on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facilityMap = useMemo(() => new Map(facilityState.rows.map((facility) => [facility.id, facility])), [facilityState.rows]);
  const affectedRouteCount = (facilityId: number) =>
    routeState.rows.filter((route) => route.facility_ids.includes(facilityId)).length;

  const filteredRows = useMemo(
    () => (filter === "ALL" ? rows : rows.filter((row) => row.verify_status === filter)),
    [rows, filter]
  );

  const counts = useMemo(() => {
    const result: Record<VerifyStatusValue, number> = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
    rows.forEach((row) => { result[row.verify_status] += 1; });
    return result;
  }, [rows]);

  const handleVerify = async (report: BarrierReport, action: "approve" | "reject") => {
    clearActionError();
    let reason = "";
    if (action === "reject") {
      const input = window.prompt(`请填写驳回原因（工单 #${report.id}）`, "现场复核未发现所述障碍");
      if (input === null) return;
      reason = input.trim();
      if (!reason) {
        window.alert("驳回原因不能为空");
        return;
      }
    }
    await verify(report.id, action, reason);
  };

  return (
    <main className="page">
      <PageHeader
        title="障碍工单"
        description="待核实工单可执行核实通过或驳回；通过将在同一请求中阻断关联设施并提升引用路线风险，重复处理由服务端返回 409。"
        extra={<button type="button" className="btn" onClick={() => void Promise.all([load(), facilityState.load(), routeState.load()])} disabled={loading}>刷新</button>}
      />

      {actionError ? (
        <div className="alert alert-error" role="alert">
          <span>{actionError}</span>
          <button type="button" className="btn btn-link" onClick={clearActionError}>关闭</button>
        </div>
      ) : null}
      {lastResult && !actionError ? (
        <div className="alert alert-success" role="status">
          {lastResult.facility
            ? `工单 #${lastResult.report.id} 已核实通过：设施 #${lastResult.facility.id} 已置为阻断，${lastResult.affectedRoutes?.length ?? 0} 条路线风险已提升为高。`
            : `工单 #${lastResult.report.id} 已驳回，关联设施与路线未变更。`}
        </div>
      ) : null}

      <section className="panel">
        <FilterBar<FilterValue>
          value={filter}
          onChange={setFilter}
          options={[
            { value: "PENDING", label: VerifyStatusLabel.PENDING, count: counts.PENDING },
            { value: "ALL", label: "全部", count: rows.length },
            { value: "APPROVED", label: VerifyStatusLabel.APPROVED, count: counts.APPROVED },
            { value: "REJECTED", label: VerifyStatusLabel.REJECTED, count: counts.REJECTED }
          ]}
        />

        {error ? (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>
            <button type="button" className="btn" onClick={() => void load()}>重试</button>
          </div>
        ) : null}

        {loading ? <div className="loading">加载中…</div> : null}

        {!loading && !error && filteredRows.length === 0 ? <EmptyState title={filter === "PENDING" ? "没有待核实工单" : "当前筛选下暂无工单"} /> : null}

        {!loading && !error ? (
          <div className="table">
            {filteredRows.map((report) => {
              const facility = facilityMap.get(report.facility_id);
              const pending = report.verify_status === VerifyStatus[0];
              return (
                <article key={report.id} className="row report-row">
                  <div className="report-main">
                    <div className="report-title">
                      <strong>工单 #{report.id}</strong>
                      <StatusBadge value={report.verify_status} label={VerifyStatusLabel[report.verify_status]} />
                      <span className={"priority priority-" + report.priority.toLowerCase()}>{report.priority} 优先级</span>
                    </div>
                    <p className="report-desc">{report.description}</p>
                    <p className="report-meta">
                      上报人 #{report.reporter_id} · 障碍类型 {report.barrier_type}
                    </p>
                  </div>
                  <div className="report-links">
                    <div className="link-block">
                      <span className="link-label">关联设施</span>
                      {facility ? <FacilityTag facility={facility} /> : <span className="link-missing">设施 #{report.facility_id}（未找到）</span>}
                    </div>
                    <div className="link-block">
                      <span className="link-label">受影响路线</span>
                      <strong className="affected-count">{affectedRouteCount(report.facility_id)} 条</strong>
                    </div>
                  </div>
                  <div className="report-actions">
                    {pending ? (
                      <>
                        <button type="button" className="btn btn-primary" disabled={processingId !== null} onClick={() => void handleVerify(report, "approve")}>
                          {processingId === report.id ? "处理中…" : "核实通过"}
                        </button>
                        <button type="button" className="btn btn-danger" disabled={processingId !== null} onClick={() => void handleVerify(report, "reject")}>
                          驳回
                        </button>
                      </>
                    ) : (
                      <span className="already-verified">已处理，不可重复操作</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
    </main>
  );
}
