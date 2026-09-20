import { useCallback, useEffect, useMemo } from "react";
import { Button, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRoutePlanStore } from "../stores/RoutePlanStore";
import { useAccessibleFacilityStore } from "../stores/AccessibleFacilityStore";
import { usePagination } from "../hooks/usePagination";
import { RouteRiskPanel } from "../components/common/RouteRiskPanel";
import { FacilityTag } from "../components/common/FacilityTag";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import type { RoutePlan } from "../types/RoutePlan";
import type { AccessibleFacility } from "../types/AccessibleFacility";
import { formatNumber, formatRouteRisk } from "../utils/formatters";

export function RoutesPage() {
  const routes = useRoutePlanStore((state) => state.rows);
  const loading = useRoutePlanStore((state) => state.loading);
  const loadRoutes = useRoutePlanStore((state) => state.load);
  const facilities = useAccessibleFacilityStore((state) => state.rows);
  const loadFacilities = useAccessibleFacilityStore((state) => state.load);
  const [messageApi, contextHolder] = message.useMessage();

  const bootstrap = useCallback(async () => {
    try {
      await Promise.all([loadRoutes(), loadFacilities()]);
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "加载路线失败");
    }
  }, [loadRoutes, loadFacilities, messageApi]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const { pageRows, page, setPage, pageSize, total } = usePagination(routes);

  const facilityMap = useMemo(
    () => new Map(facilities.map((facility) => [facility.id, facility])),
    [facilities]
  );

  const highRiskCount = useMemo(
    () => routes.filter((route) => route.risk_level === "HIGH").length,
    [routes]
  );
  const blockedCount = useMemo(
    () => facilities.filter((facility) => facility.status === "BLOCKED").length,
    [facilities]
  );

  const columns: ColumnsType<RoutePlan> = [
    { title: "路线", dataIndex: "id", width: 80, render: (id: number) => <span className="cell-strong">#{id}</span> },
    {
      title: "起终点",
      key: "path",
      render: (_, record) => (
        <div className="cell-stack">
          <strong>
            {record.origin_text} → {record.destination_text}
          </strong>
          <span className="cell-desc">出行方式 {record.route_mode}</span>
        </div>
      )
    },
    {
      title: "风险等级",
      dataIndex: "risk_level",
      width: 110,
      render: (risk: string) => <StatusBadge value={risk} label={formatRouteRisk(risk)} />
    },
    {
      title: "预计用时",
      dataIndex: "estimated_minutes",
      width: 100,
      render: (minutes: number) => `${formatNumber(minutes)} 分钟`
    },
    {
      title: "途经设施",
      dataIndex: "facility_ids",
      render: (facilityIds: number[]) => (
        <div className="facility-cell">
          {facilityIds.map((facilityId) => {
            const facility: AccessibleFacility | undefined = facilityMap.get(facilityId);
            return facility ? (
              <FacilityTag key={facilityId} facility={facility} title={facility.name} />
            ) : (
              <FacilityTag key={facilityId} title={`设施 #${facilityId}`} />
            );
          })}
        </div>
      )
    },
    {
      title: "状态提示",
      key: "risk_hint",
      width: 140,
      render: (_, record) => {
        const touchesBlocked = record.facility_ids.some((id) => facilityMap.get(id)?.status === "BLOCKED");
        return touchesBlocked ? <Tag color="red">途经停用设施</Tag> : <Tag color="green">设施可用</Tag>;
      }
    }
  ];

  return (
    <section className="page">
      {contextHolder}
      <header className="page-head">
        <div>
          <p className="eyebrow">accessroute</p>
          <h1>路线规划</h1>
          <p className="page-sub">引用停用设施的路线风险会在工单核实通过后同步置为 HIGH</p>
        </div>
        <Button onClick={() => void bootstrap().catch((error) => messageApi.error(error.message))}>从接口刷新</Button>
      </header>

      <div className="metrics metrics-two">
        <RouteRiskPanel value="HIGH" title="高风险路线" affectedCount={highRiskCount} detail="核实通过的障碍工单会同步抬高关联路线风险。" />
        <div className="shared-widget route-risk risk-blocked">
          <strong>停用设施</strong>
          <span className="risk-count">{blockedCount}</span>
          <span className="tag-meta">路线途经 BLOCKED 设施时给出避障提示</span>
        </div>
      </div>

      <div className="panel">
        {routes.length === 0 && !loading ? (
          <EmptyState title="暂无路线规划" />
        ) : (
          <Table<RoutePlan>
            rowKey="id"
            size="middle"
            loading={loading}
            columns={columns}
            dataSource={pageRows}
            pagination={{ current: page, pageSize, total, showSizeChanger: false, onChange: setPage }}
          />
        )}
      </div>
    </section>
  );
}
