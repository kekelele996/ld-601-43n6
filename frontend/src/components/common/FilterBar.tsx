import type { ReactNode } from "react";

interface FilterOption {
  value: string;
  label: ReactNode;
}

interface FilterBarProps {
  label?: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

// 设施巡检楼层筛选 / 障碍工单核实状态筛选共用
export function FilterBar({ label = "筛选", value, options, onChange }: FilterBarProps) {
  return (
    <div className="filter-bar" role="group" aria-label={label}>
      <span className="filter-label">{label}</span>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={value === option.value ? "filter-chip active" : "filter-chip"}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
