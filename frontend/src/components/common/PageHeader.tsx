import type { ReactNode } from "react";

export function PageHeader({ title, description, extra }: { title: string; description?: string; extra?: ReactNode }) {
  return (
    <section className="page-head">
      <div>
        <p className="eyebrow">accessroute</p>
        <h1>{title}</h1>
        {description ? <p className="page-desc">{description}</p> : null}
      </div>
      {extra ? <div className="page-head-extra">{extra}</div> : null}
    </section>
  );
}
