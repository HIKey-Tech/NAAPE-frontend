import React from "react";

type DashboardCardProps = {
  icon: React.ReactNode;
  value: number | string | null | undefined;
  label: string | null | undefined;
  className?: string;
};

function getDisplayValue(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return isNaN(value) ? "—" : value.toLocaleString("en-US");
  if (typeof value === "string") { const t = value.trim(); return t.length > 0 ? t : "—"; }
  return "—";
}

function getDisplayLabel(label: string | null | undefined): string {
  if (!label) return "";
  const str = String(label).trim();
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, value, label, className = "" }) => {
  const displayValue = getDisplayValue(value);
  const displayLabel = getDisplayLabel(label);

  let showIcon: React.ReactNode;
  if (React.isValidElement(icon)) {
    showIcon = React.cloneElement(icon as React.ReactElement<any>, {
      ...(icon as React.ReactElement<any>).props,
      className: [(icon as React.ReactElement<any>).props?.className ?? "", "text-2xl text-primary"].filter(Boolean).join(" "),
      "aria-hidden": true,
    });
  } else {
    showIcon = <span className="text-2xl text-slate-400" aria-hidden>—</span>;
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition-all group ${className}`}
      tabIndex={0}
      role="region"
      aria-label={displayLabel || "Statistic card"}
    >
      <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
        {showIcon}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-3xl font-black text-slate-800 tracking-tight truncate" title={displayValue}>
          {displayValue}
        </span>
        <span className="text-sm font-bold text-slate-400 mt-0.5 tracking-wide" title={displayLabel}>
          {displayLabel || <span className="italic text-slate-300">No label</span>}
        </span>
      </div>
    </div>
  );
};

export default DashboardCard;
