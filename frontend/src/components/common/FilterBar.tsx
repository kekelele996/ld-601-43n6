export interface FilterOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

export function FilterBar<T extends string>({ options, value, onChange }: {
  options: Array<FilterOption<T>>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="filter-bar" role="tablist">
      {options.map((option) => (
        <button
          key={option.value}
          className={"filter-chip" + (option.value === value ? " active" : "")}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
          {typeof option.count === "number" ? <span className="filter-count">{option.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
