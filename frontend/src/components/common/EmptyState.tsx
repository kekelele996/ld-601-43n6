export function EmptyState({ title = "暂无数据" }: { title?: string }) {
  return <div className="empty" role="status">{title}</div>;
}
