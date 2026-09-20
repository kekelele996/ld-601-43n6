import { useCallback, useEffect, useMemo } from "react";
import { Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAssistanceRequestStore } from "../stores/AssistanceRequestStore";
import { useUserProfileStore } from "../stores/UserProfileStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { UserMiniCard } from "../components/common/UserMiniCard";
import { TimelineList, type TimelineEntry } from "../components/common/TimelineList";
import { EmptyState } from "../components/common/EmptyState";
import { AssistanceStatus, AssistanceStatusText } from "../constants/AssistanceStatus";
import type { AssistanceRequest } from "../types/AssistanceRequest";
import { formatDate } from "../utils/formatters";

export function AssistancePage() {
  const rows = useAssistanceRequestStore((state) => state.rows);
  const loading = useAssistanceRequestStore((state) => state.loading);
  const load = useAssistanceRequestStore((state) => state.load);
  const users = useUserProfileStore((state) => state.rows);
  const loadUsers = useUserProfileStore((state) => state.load);
  const [messageApi, contextHolder] = message.useMessage();

  const bootstrap = useCallback(async () => {
    try {
      await Promise.all([load(), loadUsers()]);
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "加载协助请求失败");
    }
  }, [load, loadUsers, messageApi]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const userMap = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);

  const timelineEntries: TimelineEntry[] = rows.map((row) => ({
    key: row.id,
    time: formatDate(row.request_time),
    title: `#${row.id} ${row.meet_point}`,
    status: row.status,
    statusLabel: (AssistanceStatusText as Record<string, string>)[row.status] ?? row.status,
    description: row.contact_note
  }));

  const columns: ColumnsType<AssistanceRequest> = [
    { title: "请求", dataIndex: "id", render: (id: number) => <strong>#{id}</strong> },
    {
      title: "请求用户",
      dataIndex: "user_id",
      render: (userId: number) => {
        const user = userMap.get(userId);
        return user ? <UserMiniCard user={user} /> : <UserMiniCard title={`用户 #${userId}`} />;
      }
    },
    { title: "集合点", dataIndex: "meet_point" },
    { title: "联系备注", dataIndex: "contact_note" },
    { title: "请求时间", dataIndex: "request_time", render: (value: string) => formatDate(value) },
    {
      title: "状态",
      dataIndex: "status",
      render: (status: string) => (
        <StatusBadge
          value={status}
          label={(AssistanceStatusText as Record<string, string>)[status] ?? AssistanceStatus[0]}
        />
      )
    }
  ];

  return (
    <section className="page">
      {contextHolder}
      <header className="page-head">
        <div>
          <p className="eyebrow">accessroute</p>
          <h1>协助调度</h1>
        </div>
      </header>
      <div className="panel">
        {rows.length === 0 && !loading ? (
          <EmptyState title="暂无协助请求" />
        ) : (
          <Table<AssistanceRequest> rowKey="id" size="middle" loading={loading} columns={columns} dataSource={rows} pagination={false} />
        )}
      </div>
      <TimelineList title="请求时间线" entries={timelineEntries} />
    </section>
  );
}
