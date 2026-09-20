import type { ReactNode } from "react";

interface StatusBadgeProps {
  value: string;
  label?: ReactNode;
}

export function StatusBadge({ value, label }: StatusBadgeProps) {
  return (
    <span className={"badge " + String(value).toLowerCase().replace(/_/g, "-")}>
      {label ?? String(value).replace(/_/g, " ")}
    </span>
  );
}
