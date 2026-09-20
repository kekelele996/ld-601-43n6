import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { FacilityTag } from "../components/common/FacilityTag";
import { EmptyState } from "../components/common/EmptyState";
import { FilterBar } from "../components/common/FilterBar";
import { FacilityStatus, FacilityStatusLabel, type FacilityStatus as FacilityStatusValue } from "../constants/FacilityStatus";
import { useAccessibleFacilityStore } from "../stores/AccessibleFacilityStore";
import { useBarrierReportStore } from "../stores/BarrierReportStore";
import { formatDate } from "../utils/formatters";

type FilterValue = "ALL" | FacilityStatusValue;

export function FacilitiesPage() {
  const { rows, loading, error, load } = useAccessibleFacilityStore();
  const reportState = useBarrierReportStore();
  const [filter, setFilter] = useState<FilterValue>("ALL");

  useEffect(() => {
    void Promise.all([load(), reportState.load()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingByFacility = useMemo(() => {
    const map = new Map<number, number>();
    reportState.rows.forEach((report) => {
      if (report.verify_status === "PENDING") map.set(report.facility_id, (map.get(report.facility_id) ?? 0) + 1);
    });
    return map;
  }, [reportState.rows]);

  const filteredRows = useMemo(
    () => (filter === "ALL" ? rows : rows.filter((facility) => facility.status === filter)),
    [rows, filter]
  );

  return (
    <main className="page">
      <PageHeader
        title="设施巡检"
        description="展示最新设施状态：障碍工单核实通过后，关联设施会同步置为阻断并刷新巡检时间。"
        extra={<button type="button" className="btn" onClick={() => void Promise.all([load(), reportState.load()])} disabled={loading}>刷新</button>}
      />

      <section className="panel">
        <FilterBar<FilterValue>
          value={filter}
          onChange={setFilter}
          options={[
            { value: "ALL", label: "全部" },
            ...FacilityStatus.map((status) => ({ value: status, label: FacilityStatusLabel[status] }))
          ]}
        />

        {error ? (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>
            <button type="button" className="btn" onClick={() => void load()}>重试</button>
          </div>
        ) : null}
        {loading ? <div className="loading">加载中…</div> : null}
        {!loading && !error && filteredRows.length === 0 ? <EmptyState title="当前筛选下暂无设施" /> : null}

        {!loading && !error ? (
          <div className="table">
            {filteredRows.map((facility) => (
              <article key={facility.id} className="row facility-row">
                <div className="facility-main">
                  <FacilityTag facility={facility} />
                  <p className="report-meta">
                    {facility.location_code} · {facility.floor} · 责任部门 {facility.owner_department}
                  </p>
                  <p className="report-meta">最近巡检：{formatDate(facility.last_checked_at)}</p>
                </div>
                <div className="facility-side">
                  <StatusBadge value={facility.status} label={FacilityStatusLabel[facility.status]} />
                  <span className="report-meta">
                    {pendingByFacility.get(facility.id) ? `待核实工单 ${pendingByFacility.get(facility.id)} 件` : "暂无待核实工单"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
