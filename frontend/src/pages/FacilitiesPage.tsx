import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAccessibleFacilityStore } from "../stores/AccessibleFacilityStore";
import { useBarrierReportStore } from "../stores/BarrierReportStore";
import { FilterBar } from "../components/common/FilterBar";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { FacilityStatus, FacilityStatusText } from "../constants/FacilityStatus";
import type { AccessibleFacility } from "../types/AccessibleFacility";
import { formatDate } from "../utils/formatters";

const FLOOR_ALL = "ALL";

const STATUS_OPTIONS = [
  { value: FLOOR_ALL, label: "全部状态" },
  ...FacilityStatus.map((status) => ({ value: status, label: FacilityStatusText[status] }))
];

export function FacilitiesPage() {
  const facilities = useAccessibleFacilityStore((state) => state.rows);
  const loading = useAccessibleFacilityStore((state) => state.loading);
  const load = useAccessibleFacilityStore((state) => state.load);
  const reports = useBarrierReportStore((state) => state.rows);
  const loadReports = useBarrierReportStore((state) => state.load);
  const [floorFilter, setFloorFilter] = useState<string>(FLOOR_ALL);
  const [statusFilter, setStatusFilter] = useState<string>(FLOOR_ALL);
  const [messageApi, contextHolder] = message.useMessage();

  const bootstrap = useCallback(async () => {
    try {
      await Promise.all([load(), loadReports()]);
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "加载设施失败");
    }
  }, [load, loadReports, messageApi]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const floors = useMemo(
    () => Array.from(new Set(facilities.map((facility) => facility.floor))),
    [facilities]
  );
  const floorOptions = useMemo(
    () => [{ value: FLOOR_ALL, label: "全部楼层" }, ...floors.map((floor) => ({ value: floor, label: floor }))],
    [floors]
  );

  const pendingReportCountOf = useCallback(
    (facilityId: number) =>
      reports.filter((report) => report.facility_id === facilityId && report.verify_status === "PENDING").length,
    [reports]
  );

  const rows = useMemo(
    () =>
      facilities.filter(
        (facility) =>
          (floorFilter === FLOOR_ALL || facility.floor === floorFilter) &&
          (statusFilter === FLOOR_ALL || facility.status === statusFilter)
      ),
    [facilities, floorFilter, statusFilter]
  );

  const columns: ColumnsType<AccessibleFacility> = [
    { title: "设施名称", dataIndex: "name", render: (name: string) => <strong>{name}</strong> },
    { title: "类型", dataIndex: "facility_type", width: 120 },
    { title: "位置编码", dataIndex: "location_code", width: 180 },
    { title: "楼层", dataIndex: "floor", width: 100 },
    {
      title: "状态",
      dataIndex: "status",
      width: 130,
      render: (status: string) => (
        <StatusBadge value={status} label={(FacilityStatusText as Record<string, string>)[status] ?? status} />
      )
    },
    {
      title: "待核实工单",
      key: "pending_reports",
      width: 110,
      render: (_, record) =>
        pendingReportCountOf(record.id) > 0 ? (
          <Tag color="red">{pendingReportCountOf(record.id)} 条待核实</Tag>
        ) : (
          <Tag>无</Tag>
        )
    },
    {
      title: "最近巡检",
      dataIndex: "last_checked_at",
      width: 180,
      render: (value: string) => formatDate(value)
    },
    { title: "责任部门", dataIndex: "owner_department", width: 130 },
    { title: "备注", dataIndex: "note" }
  ];

  return (
    <section className="page">
      {contextHolder}
      <header className="page-head">
        <div>
          <p className="eyebrow">accessroute</p>
          <h1>设施巡检</h1>
          <p className="page-sub">障碍工单核实通过后，被停用设施会在本页同步显示为 BLOCKED</p>
        </div>
        <Button onClick={() => void bootstrap().catch((error) => messageApi.error(error.message))}>从接口刷新</Button>
      </header>

      <div className="filter-stack">
        <FilterBar label="楼层" value={floorFilter} options={floorOptions} onChange={setFloorFilter} />
        <FilterBar label="状态" value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} />
      </div>

      <div className="panel">
        {rows.length === 0 && !loading ? (
          <EmptyState title="当前筛选下暂无设施" />
        ) : (
          <Table<AccessibleFacility> rowKey="id" size="middle" loading={loading} columns={columns} dataSource={rows} pagination={false} />
        )}
      </div>
    </section>
  );
}
