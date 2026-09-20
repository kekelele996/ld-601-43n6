import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Popconfirm, Space, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useBarrierReportStore } from "../stores/BarrierReportStore";
import { useAccessibleFacilityStore } from "../stores/AccessibleFacilityStore";
import { useRoutePlanStore } from "../stores/RoutePlanStore";
import { useBarrierVerifyFlow } from "../hooks/useBarrierVerifyFlow";
import { usePagination } from "../hooks/usePagination";
import { FilterBar } from "../components/common/FilterBar";
import { StatusBadge } from "../components/common/StatusBadge";
import { FacilityTag } from "../components/common/FacilityTag";
import { RouteRiskPanel } from "../components/common/RouteRiskPanel";
import { EmptyState } from "../components/common/EmptyState";
import { BarrierVerifyStatus, BarrierVerifyStatusText } from "../constants/BarrierVerifyStatus";
import type { BarrierReport } from "../types/BarrierReport";
import type { VerifyDecision } from "../types/VerifyDecision";
import { formatPriority, formatVerifyStatus } from "../utils/formatters";

const FILTER_OPTIONS = [
  { value: BarrierVerifyStatus[0], label: BarrierVerifyStatusText.PENDING },
  { value: "ALL", label: "全部工单" },
  { value: BarrierVerifyStatus[1], label: BarrierVerifyStatusText.APPROVED },
  { value: BarrierVerifyStatus[2], label: BarrierVerifyStatusText.REJECTED }
];

export function ReportsPage() {
  const reports = useBarrierReportStore((state) => state.rows);
  const reportsLoading = useBarrierReportStore((state) => state.loading);
  const loadReports = useBarrierReportStore((state) => state.load);
  const facilities = useAccessibleFacilityStore((state) => state.rows);
  const loadFacilities = useAccessibleFacilityStore((state) => state.load);
  const routes = useRoutePlanStore((state) => state.rows);
  const loadRoutes = useRoutePlanStore((state) => state.load);
  const { verify, processingId, refreshRelated } = useBarrierVerifyFlow();

  // 障碍工单页默认筛选“待核实”
  const [filter, setFilter] = useState<string>(BarrierVerifyStatus[0]);
  const [messageApi, contextHolder] = message.useMessage();

  const bootstrap = useCallback(async () => {
    try {
      await Promise.all([loadReports(), loadFacilities(), loadRoutes()]);
    } catch (error) {
      // 服务端失败直接提示，不回退本地假数据
      messageApi.error(error instanceof Error ? error.message : "加载工单失败");
    }
  }, [loadReports, loadFacilities, loadRoutes, messageApi]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const facilityMap = useMemo(
    () => new Map(facilities.map((facility) => [facility.id, facility])),
    [facilities]
  );
  const affectedRouteCountOf = useCallback(
    (facilityId: number) => routes.filter((route) => route.facility_ids.includes(facilityId)).length,
    [routes]
  );

  const filteredReports = useMemo(
    () => (filter === "ALL" ? reports : reports.filter((row) => row.verify_status === filter)),
    [reports, filter]
  );
  const { pageRows, page, setPage, pageSize, total } = usePagination(filteredReports);

  const pendingCount = useMemo(
    () => reports.filter((row) => row.verify_status === BarrierVerifyStatus[0]).length,
    [reports]
  );

  const handleVerify = useCallback(
    async (report: BarrierReport, decision: VerifyDecision) => {
      try {
        const result = await verify(report.id, decision);
        if (decision === "APPROVED") {
          messageApi.success(
            `已核实通过：${result.facility?.name ?? "关联设施"}已停用，${result.affectedRouteCount} 条路线风险置为高`
          );
        } else {
          messageApi.success("工单已驳回");
        }
        // 操作后数据已在 verify 内通过接口刷新，这里仅确保停留在合法分页
        if (pageRows.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } catch (error) {
        // 409 重复处理 / 服务端异常都直接提示，本地状态不回退
        messageApi.error(error instanceof Error ? error.message : "核实失败，请稍后重试");
      }
    },
    [verify, messageApi, pageRows.length, page, setPage]
  );

  const columns: ColumnsType<BarrierReport> = [
    {
      title: "工单",
      dataIndex: "id",
      width: 90,
      render: (id: number) => <span className="cell-strong">#{id}</span>
    },
    {
      title: "障碍类型",
      dataIndex: "barrier_type",
      render: (barrierType: string, record) => (
        <div className="cell-stack">
          <strong>{barrierType}</strong>
          <span className="cell-desc">{record.description}</span>
        </div>
      )
    },
    {
      title: "关联设施",
      dataIndex: "facility_id",
      render: (facilityId: number) => {
        const facility = facilityMap.get(facilityId);
        return facility ? <FacilityTag facility={facility} /> : <FacilityTag title={`设施 #${facilityId}`} />;
      }
    },
    {
      title: "受影响路线",
      key: "affected_routes",
      width: 120,
      render: (_, record) => <Tag color="orange">{affectedRouteCountOf(record.facility_id)} 条</Tag>
    },
    {
      title: "优先级",
      dataIndex: "priority",
      width: 90,
      render: (priority: string) => <Tag>{formatPriority(priority)}</Tag>
    },
    {
      title: "核实状态",
      dataIndex: "verify_status",
      width: 110,
      render: (status: string) => <StatusBadge value={status} label={formatVerifyStatus(status)} />
    },
    {
      title: "操作",
      key: "actions",
      width: 190,
      render: (_, record) => {
        const pending = record.verify_status === BarrierVerifyStatus[0];
        const processing = processingId === record.id;
        if (!pending) {
          return <span className="cell-hint">已处理，禁止重复操作</span>;
        }
        return (
          <Space>
            <Popconfirm
              title="核实通过该障碍工单？"
              description="同一请求内将停用关联设施，并把引用该设施的路线风险置为 HIGH。"
              okText="核实通过"
              cancelText="取消"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleVerify(record, "APPROVED")}
            >
              <Button type="primary" danger size="small" loading={processing}>
                核实通过
              </Button>
            </Popconfirm>
            <Popconfirm
              title="驳回该障碍工单？"
              description="驳回只更新工单状态，不改动设施与路线。"
              okText="确认驳回"
              cancelText="取消"
              onConfirm={() => handleVerify(record, "REJECTED")}
            >
              <Button size="small" disabled={processing}>
                驳回
              </Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <section className="page">
      {contextHolder}
      <header className="page-head">
        <div>
          <p className="eyebrow">accessroute</p>
          <h1>障碍工单</h1>
          <p className="page-sub">待核实 {pendingCount} 条 · 通过将同步停用设施并抬高路线风险，驳回仅更新工单</p>
        </div>
        <Button onClick={() => void refreshRelated().catch((error) => messageApi.error(error.message))}>
          从接口刷新
        </Button>
      </header>

      <FilterBar label="核实状态" value={filter} options={FILTER_OPTIONS} onChange={setFilter} />

      <div className="panel">
        {filteredReports.length === 0 && !reportsLoading ? (
          <EmptyState title={filter === BarrierVerifyStatus[0] ? "暂无待核实工单" : "当前筛选下暂无工单"} />
        ) : (
          <Table<BarrierReport>
            rowKey="id"
            size="middle"
            loading={reportsLoading}
            columns={columns}
            dataSource={pageRows}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: false,
              onChange: setPage
            }}
          />
        )}
      </div>

      <div className="metrics metrics-single">
        <RouteRiskPanel
          value="HIGH"
          title="通过核实的联动结果"
          affectedCount={routes.filter((route) => route.risk_level === "HIGH").length}
          detail="核实通过后，引用被停用设施的路线风险在同一次服务端请求中置为 HIGH，设施巡检与路线规划页同步可见。"
        />
      </div>
    </section>
  );
}
