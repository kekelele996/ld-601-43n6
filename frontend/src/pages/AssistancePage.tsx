import { useEffect } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { useAssistanceRequestStore } from "../stores/AssistanceRequestStore";

export function AssistancePage() {
  const { rows, loading, error, load } = useAssistanceRequestStore();

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="page">
      <PageHeader title="协助调度" description="查看协助请求与处理状态。" />
      <section className="panel">
        {error ? <div className="alert alert-error" role="alert"><span>{error}</span></div> : null}
        {loading ? <div className="loading">加载中…</div> : null}
        {!loading && !error && rows.length === 0 ? <EmptyState title="暂无协助请求" /> : null}
        <div className="table">
          {rows.map((request) => (
            <article key={request.id} className="row">
              <strong>请求 #{request.id}</strong>
              <span className="report-meta">用户 #{request.user_id} · 路线 #{request.route_plan_id} · 集合点 {request.meet_point}</span>
              <StatusBadge value={request.status} />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
