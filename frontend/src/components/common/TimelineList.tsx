import type { ReactNode } from "react";
import { StatusBadge } from "./StatusBadge";

export interface TimelineEntry {
  key: string | number;
  time?: string;
  title: ReactNode;
  status?: string;
  statusLabel?: ReactNode;
  description?: ReactNode;
}

interface TimelineListProps {
  title?: string;
  value?: string;
  entries?: TimelineEntry[];
}

export function TimelineList({ title = "处理记录", value, entries }: TimelineListProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="shared-widget timeline">
        <strong>{title}</strong>
        {value && <StatusBadge value={value} />}
      </div>
    );
  }
  return (
    <div className="shared-widget timeline">
      <strong>{title}</strong>
      <ol className="timeline-entries">
        {entries.map((entry) => (
          <li key={entry.key} className="timeline-entry">
            {entry.time && <time>{entry.time}</time>}
            <span className="timeline-title">{entry.title}</span>
            {entry.status && <StatusBadge value={entry.status} label={entry.statusLabel} />}
            {entry.description && <p>{entry.description}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
